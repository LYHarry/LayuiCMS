'use strict'

const chokidar = require('chokidar')
const bodyParser = require('body-parser')
const assert = require('assert').strict
const glob = require('glob')
const {
    appMockPath
} = require('../build/path.util')



const getMockFiles = () => {
    return glob.sync(`${appMockPath}/*.js`, {
        matchBase: true,
        nodir: true,
        ignore: ''
    })
}

const getMockConfig = (files) => {
    return files.reduce((memo, mockFile) => {
        try {
            const data = require(mockFile)
            memo = {
                ...memo,
                ...(data.default || data),
            };
            return memo;
        } catch (e) {
            throw new Error(`加载 mock 文件出错：${e.stack}`)
        }
    }, {})
}

const normalizeConfig = (config) => {
    return Object.keys(config).reduce((memo, key) => {
        const handler = config[key];
        const type = typeof (handler);
        assert(
            type === 'function' || type === 'object',
            `mock value of ${key} should be function or object, but got ${type}`,
        );
        const {
            method,
            path
        } = parseKey(key);
        const response = createHandler(method, path, handler)
        memo.push({
            method,
            path,
            response
        });
        return memo;
    }, [])
}

const parseKey = (key) => {
    let method = 'GET',
        path = key;
    if (/\s+/.test(key)) {
        const splited = key.split(/\s+/);
        method = splited[0].toUpperCase();
        path = splited[1];
    }
    assert(
        ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'].includes(method),
        `Invalid method ${method} for path ${path}, please check your mock files.`,
    );
    return {
        method,
        path
    }
}

const createHandler = (method, path, handler) => {
    return function (req, res, next) {
        if (req.method === method) {
            if (typeof (handler) === 'function') {
                handler(req, res, next)
            } else {
                res.json(handler)
            }
            return true;
        }
        res.send(`当前请求方式 ${req.method} ，接口所需请求方式 ${method}`)
    }
}

const registerRoutes = (app) => {
    const mockData = normalizeConfig(getMockConfig(getMockFiles()))
    let mockLastIndex = 0;
    for (const mock of mockData) {
        const {
            path,
            method,
            response
        } = mock;
        console.log(`path: ${path} \t method: ${method}  `)
        app.all(`/api${path}`, response);
        mockLastIndex = app._router.stack.length;
    }
    console.log('') //用于换行
    const mockRoutesLength = Object.keys(mockData).length
    return {
        mockRoutesLength: mockRoutesLength,
        mockStartIndex: mockLastIndex - mockRoutesLength
    }
}

const unregisterRoutes = () => {
    Object.keys(require.cache).forEach(file => {
        if (file.includes(appMockPath)) {
            delete require.cache[file]
        }
    })
}

module.exports = (app, req, res) => {
    console.log('\n') //用于换行
    require("babel-register")

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    // reguster routes
    const mockRoutes = registerRoutes(app)
    var mockRoutesLength = mockRoutes.mockRoutesLength
    var mockStartIndex = mockRoutes.mockStartIndex

    // watch mock data file
    chokidar.watch(appMockPath, {
        ignoreInitial: true,
    }).on('all', (event, path) => {
        try {
            if (event === 'change' || event === 'add') {
                console.log('\n mock file has changed again register route')
                // remove mock routes stack
                app._router.stack.splice(mockStartIndex, mockRoutesLength)

                // clear mock routes cache
                unregisterRoutes();

                // reguster routes
                const mockRoutes = registerRoutes(app)
                mockRoutesLength = mockRoutes.mockRoutesLength
                mockStartIndex = mockRoutes.mockStartIndex
            }
        } catch (error) {
            throw new Error(error)
        }
    });

}