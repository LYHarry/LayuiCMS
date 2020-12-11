import config from '@/config'

/*富文本编辑图片上传配置*/
const uploadConfig = {
    action: envConfig.BASE_URL + config.fileUploadUrl, // 必填参数 图片上传地址 
    methods: 'POST', // 必填参数 图片上传方式
    token: '', // 可选参数 如果需要token验证，假设你的token有存放在sessionStorage
    name: 'file', // 必填参数 文件的参数名
    size: config.uploadFileMaxSize, // 可选参数   图片大小，单位为Kb, 1M = 1024Kb
    accept: config.uploadFileType // 可选 可上传的图片格式
};

// toolbar工具栏的工具选项（默认展示全部）
const toolOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{
        'header': 1
    }, {
        'header': 2
    }],
    [{
        'list': 'ordered'
    }, {
        'list': 'bullet'
    }],
    [{
        'script': 'sub'
    }, {
        'script': 'super'
    }],
    [{
        'indent': '-1'
    }, {
        'indent': '+1'
    }],
    [{
        'direction': 'rtl'
    }],
    [{
        'size': ['small', false, 'large', 'huge']
    }],
    [{
        'header': [1, 2, 3, 4, 5, 6, false]
    }],
    [{
        'color': []
    }, {
        'background': []
    }],
    [{
        'font': []
    }],
    [{
        'align': []
    }],
    ['clean'],
    ['link', 'image', 'video']
];

//事件
const handlers = {
    image: function image(file) {
        var self = this;
        var fileInput = this.container.querySelector('input.ql-image[type=file]');
        if (fileInput !== null) {
            fileInput.click()
            return false
        }
        fileInput = document.createElement('input');
        fileInput.setAttribute('type', 'file');
        // 设置图片参数名
        if (uploadConfig.name) {
            fileInput.setAttribute('name', uploadConfig.name);
        }
        // 可设置上传图片的格式
        fileInput.setAttribute('accept', uploadConfig.accept.join(','));
        fileInput.classList.add('ql-image');
        // 监听选择文件
        fileInput.addEventListener('change', function () {
            // 创建formData
            var formData = new FormData();
            formData.append(uploadConfig.name, fileInput.files[0]);
            // 如果需要token且存在token
            if (uploadConfig.token) {
                formData.append('token', uploadConfig.token)
            }
            // 图片上传
            var xhr = new XMLHttpRequest();
            xhr.open(uploadConfig.methods, uploadConfig.action, true);
            // 上传数据成功，会触发
            xhr.onload = function (e) {
                if (xhr.status === 200) {
                    let res = JSON.parse(xhr.responseText);
                    if (res.serveStatus === 200 && res.status === 1) {
                        let length = self.quill.getSelection(true).index;
                        //这里很重要，你图片上传成功后，img的src需要在这里添加，res.path就是你服务器返回的图片链接。
                        self.quill.insertEmbed(length, 'image', res.data);
                        self.quill.setSelection(length + 1)
                    }
                }
                fileInput.value = ''
            };
            // 开始上传数据
            xhr.upload.onloadstart = function (e) {
                fileInput.value = ''
            };
            // 当发生网络异常的时候会触发，如果上传数据的过程还未结束
            xhr.upload.onerror = function (e) {};
            // 上传数据完成（成功或者失败）时会触发
            xhr.upload.onloadend = function (e) {
                // console.log('上传结束')
            };
            xhr.send(formData)
        });
        this.container.appendChild(fileInput);
        fileInput.click();
    }
};


export default {
    theme: 'snow', // 主题
    placeholder: '请输入正文',
    modules: {
        imageDrop: true,
        imageResize: {
            displayStyles: {
                backgroundColor: "black",
                border: "none",
                color: "white"
            },
            modules: ["Resize", "DisplaySize", "Toolbar"]
        },
        toolbar: {
            container: toolOptions, // 工具栏选项
            handlers: handlers // 事件重写
        }
    }
};