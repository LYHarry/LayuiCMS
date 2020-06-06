import Mock from 'mockjs'
import apiUrl from '@/apis/urls/manage'

const orgTree = {
  url: apiUrl.orgTree,
  response: [{
    'key': 'key-01',
    'title': '研发中心',
    'icon': 'mail',
    'children': [{
      'key': 'key-01-01',
      'title': '后端组',
      'icon': null,
      'group': true,
      children: [{
        'key': 'key-01-01-01',
        'title': 'JAVA',
        'icon': null
      },
      {
        'key': 'key-01-01-02',
        'title': 'PHP',
        'icon': null
      },
      {
        'key': 'key-01-01-03',
        'title': 'Golang',
        'icon': null
      }
      ]
    }, {
      'key': 'key-01-02',
      'title': '前端组',
      'icon': null,
      'group': true,
      children: [{
        'key': 'key-01-02-01',
        'title': 'React',
        'icon': null
      },
      {
        'key': 'key-01-02-02',
        'title': 'Vue',
        'icon': null
      },
      {
        'key': 'key-01-02-03',
        'title': 'Angular',
        'icon': null
      }
      ]
    }]
  }, {
    'key': 'key-02',
    'title': '财务部',
    'icon': 'dollar',
    'children': [{
      'key': 'key-02-01',
      'title': '会计核算',
      'icon': null
    }, {
      'key': 'key-02-02',
      'title': '成本控制',
      'icon': null
    }, {
      'key': 'key-02-03',
      'title': '内部控制',
      'icon': null,
      'children': [{
        'key': 'key-02-03-01',
        'title': '财务制度建设',
        'icon': null
      },
      {
        'key': 'key-02-03-02',
        'title': '会计核算',
        'icon': null
      }
      ]
    }]
  }]
}

const role = {
  url: apiUrl.role,
  response: {
    data: [{
      'id': 'admin',
      'name': '管理员',
      'describe': '拥有所有权限',
      'status': 1,
      'creatorId': 'system',
      'createTime': 1497160610259,
      'deleted': 0,
      'permissions': [{
        'roleId': 'admin',
        'permissionId': 'comment',
        'permissionName': '评论管理',
        'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"edit","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        'actionEntitySet': [{
          'action': 'add',
          'describe': '新增',
          'defaultCheck': false
        },
        {
          'action': 'query',
          'describe': '查询',
          'defaultCheck': false
        },
        {
          'action': 'get',
          'describe': '详情',
          'defaultCheck': false
        },
        {
          'action': 'edit',
          'describe': '修改',
          'defaultCheck': false
        },
        {
          'action': 'delete',
          'describe': '删除',
          'defaultCheck': false
        }],
        'actionList': ['delete', 'edit'],
        'dataAccess': null
      },
      {
        'roleId': 'admin',
        'permissionId': 'member',
        'permissionName': '会员管理',
        'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"edit","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        'actionEntitySet': [{
          'action': 'add',
          'describe': '新增',
          'defaultCheck': false
        },
        {
          'action': 'query',
          'describe': '查询',
          'defaultCheck': false
        },
        {
          'action': 'get',
          'describe': '详情',
          'defaultCheck': false
        },
        {
          'action': 'edit',
          'describe': '修改',
          'defaultCheck': false
        },
        {
          'action': 'delete',
          'describe': '删除',
          'defaultCheck': false
        }
        ],
        'actionList': ['query', 'get', 'edit', 'delete'],
        'dataAccess': null
      },
      {
        'roleId': 'admin',
        'permissionId': 'menu',
        'permissionName': '菜单管理',
        'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"import","defaultCheck":false,"describe":"导入"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"edit","defaultCheck":false,"describe":"修改"}]',
        'actionEntitySet': [{
          'action': 'add',
          'describe': '新增',
          'defaultCheck': false
        },
        {
          'action': 'import',
          'describe': '导入',
          'defaultCheck': false
        },
        {
          'action': 'get',
          'describe': '详情',
          'defaultCheck': false
        },
        {
          'action': 'edit',
          'describe': '修改',
          'defaultCheck': false
        }
        ],
        'actionList': ['add', 'import'],
        'dataAccess': null
      },
      {
        'roleId': 'admin',
        'permissionId': 'order',
        'permissionName': '订单管理',
        'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"edit","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        'actionEntitySet': [{
          'action': 'add',
          'describe': '新增',
          'defaultCheck': false
        },
        {
          'action': 'query',
          'describe': '查询',
          'defaultCheck': false
        },
        {
          'action': 'get',
          'describe': '详情',
          'defaultCheck': false
        },
        {
          'action': 'edit',
          'describe': '修改',
          'defaultCheck': false
        },
        {
          'action': 'delete',
          'describe': '删除',
          'defaultCheck': false
        }
        ],
        'actionList': ['query', 'add', 'get'],
        'dataAccess': null
      },
      {
        'roleId': 'admin',
        'permissionId': 'permission',
        'permissionName': '权限管理',
        'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"edit","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        'actionEntitySet': [{
          'action': 'add',
          'describe': '新增',
          'defaultCheck': false
        },
        {
          'action': 'get',
          'describe': '详情',
          'defaultCheck': false
        },
        {
          'action': 'edit',
          'describe': '修改',
          'defaultCheck': false
        },
        {
          'action': 'delete',
          'describe': '删除',
          'defaultCheck': false
        }
        ],
        'actionList': ['add', 'get', 'edit', 'delete'],
        'dataAccess': null
      },
      {
        'roleId': 'admin',
        'permissionId': 'role',
        'permissionName': '角色管理',
        'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"edit","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        'actionEntitySet': [{
          'action': 'add',
          'describe': '新增',
          'defaultCheck': false
        },
        {
          'action': 'get',
          'describe': '详情',
          'defaultCheck': false
        },
        {
          'action': 'edit',
          'describe': '修改',
          'defaultCheck': false
        },
        {
          'action': 'delete',
          'describe': '删除',
          'defaultCheck': false
        }
        ],
        'actionList': null,
        'dataAccess': null
      },
      {
        'roleId': 'admin',
        'permissionId': 'test',
        'permissionName': '测试权限',
        'actions': '[]',
        'actionEntitySet': [],
        'actionList': null,
        'dataAccess': null
      },
      {
        'roleId': 'admin',
        'permissionId': 'user',
        'permissionName': '用户管理',
        'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"import","defaultCheck":false,"describe":"导入"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"edit","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"},{"action":"export","defaultCheck":false,"describe":"导出"}]',
        'actionEntitySet': [{
          'action': 'add',
          'describe': '新增',
          'defaultCheck': false
        },
        {
          'action': 'import',
          'describe': '导入',
          'defaultCheck': false
        },
        {
          'action': 'get',
          'describe': '详情',
          'defaultCheck': false
        },
        {
          'action': 'edit',
          'describe': '修改',
          'defaultCheck': false
        },
        {
          'action': 'delete',
          'describe': '删除',
          'defaultCheck': false
        },
        {
          'action': 'export',
          'describe': '导出',
          'defaultCheck': false
        }
        ],
        'actionList': ['add', 'get'],
        'dataAccess': null
      }
      ]
    },
    {
      'id': 'svip',
      'name': 'SVIP',
      'describe': '超级会员',
      'status': 1,
      'creatorId': 'system',
      'createTime': 1532417744846,
      'deleted': 0,
      'permissions': [{
        'roleId': 'admin',
        'permissionId': 'comment',
        'permissionName': '评论管理',
        'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"edit","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        'actionEntitySet': [{
          'action': 'add',
          'describe': '新增',
          'defaultCheck': false
        },
        {
          'action': 'query',
          'describe': '查询',
          'defaultCheck': false
        },
        {
          'action': 'get',
          'describe': '详情',
          'defaultCheck': false
        },
        {
          'action': 'edit',
          'describe': '修改',
          'defaultCheck': false
        },
        {
          'action': 'delete',
          'describe': '删除',
          'defaultCheck': false
        }
        ],
        'actionList': ['add', 'get', 'delete'],
        'dataAccess': null
      },
      {
        'roleId': 'admin',
        'permissionId': 'member',
        'permissionName': '会员管理',
        'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"edit","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        'actionEntitySet': [{
          'action': 'add',
          'describe': '新增',
          'defaultCheck': false
        },
        {
          'action': 'query',
          'describe': '查询',
          'defaultCheck': false
        },
        {
          'action': 'get',
          'describe': '详情',
          'defaultCheck': false
        }
        ],
        'actionList': ['add', 'query', 'get'],
        'dataAccess': null
      },
      {
        'roleId': 'admin',
        'permissionId': 'menu',
        'permissionName': '菜单管理',
        'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"import","defaultCheck":false,"describe":"导入"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"edit","defaultCheck":false,"describe":"修改"}]',
        'actionEntitySet': [{
          'action': 'add',
          'describe': '新增',
          'defaultCheck': false
        },
        {
          'action': 'import',
          'describe': '导入',
          'defaultCheck': false
        },
        {
          'action': 'get',
          'describe': '详情',
          'defaultCheck': false
        }
        ],
        'actionList': ['add', 'get'],
        'dataAccess': null
      },
      {
        'roleId': 'admin',
        'permissionId': 'order',
        'permissionName': '订单管理',
        'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"edit","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        'actionEntitySet': [{
          'action': 'add',
          'describe': '新增',
          'defaultCheck': false
        },
        {
          'action': 'query',
          'describe': '查询',
          'defaultCheck': false
        },
        {
          'action': 'get',
          'describe': '详情',
          'defaultCheck': false
        },
        {
          'action': 'edit',
          'describe': '修改',
          'defaultCheck': false
        }
        ],
        'actionList': ['add', 'query'],
        'dataAccess': null
      },
      {
        'roleId': 'admin',
        'permissionId': 'permission',
        'permissionName': '权限管理',
        'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"edit","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        'actionEntitySet': [{
          'action': 'add',
          'describe': '新增',
          'defaultCheck': false
        },
        {
          'action': 'get',
          'describe': '详情',
          'defaultCheck': false
        },
        {
          'action': 'edit',
          'describe': '修改',
          'defaultCheck': false
        }
        ],
        'actionList': ['add', 'get', 'edit'],
        'dataAccess': null
      },
      {
        'roleId': 'admin',
        'permissionId': 'role',
        'permissionName': '角色管理',
        'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"edit","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        'actionEntitySet': [{
          'action': 'add',
          'describe': '新增',
          'defaultCheck': false
        },
        {
          'action': 'edit',
          'describe': '修改',
          'defaultCheck': false
        },
        {
          'action': 'delete',
          'describe': '删除',
          'defaultCheck': false
        }
        ],
        'actionList': null,
        'dataAccess': null
      },
      {
        'roleId': 'admin',
        'permissionId': 'test',
        'permissionName': '测试权限',
        'actions': '[]',
        'actionEntitySet': [],
        'actionList': ['add', 'edit'],
        'dataAccess': null
      },
      {
        'roleId': 'admin',
        'permissionId': 'user',
        'permissionName': '用户管理',
        'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"import","defaultCheck":false,"describe":"导入"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"edit","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"},{"action":"export","defaultCheck":false,"describe":"导出"}]',
        'actionEntitySet': [{
          'action': 'add',
          'describe': '新增',
          'defaultCheck': false
        },
        {
          'action': 'import',
          'describe': '导入',
          'defaultCheck': false
        },
        {
          'action': 'get',
          'describe': '详情',
          'defaultCheck': false
        },
        {
          'action': 'edit',
          'describe': '修改',
          'defaultCheck': false
        }
        ],
        'actionList': ['add'],
        'dataAccess': null
      }
      ]
    },
    {
      'id': 'user',
      'name': '普通会员',
      'describe': '普通用户，只能查询',
      'status': 1,
      'creatorId': 'system',
      'createTime': 1497160610259,
      'deleted': 0,
      'permissions': [{
        'roleId': 'user',
        'permissionId': 'comment',
        'permissionName': '评论管理',
        'actions': '[{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"}]',
        'actionEntitySet': [{
          'action': 'query',
          'describe': '查询',
          'defaultCheck': false
        },
        {
          'action': 'get',
          'describe': '详情',
          'defaultCheck': false
        }
        ],
        'actionList': ['query'],
        'dataAccess': null
      },

      {
        'roleId': 'user',
        'permissionId': 'marketing',
        'permissionName': '营销管理',
        'actions': '[]',
        'actionEntitySet': [],
        'actionList': null,
        'dataAccess': null
      },
      {
        'roleId': 'user',
        'permissionId': 'member',
        'permissionName': '会员管理',
        'actions': '[{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"}]',
        'actionEntitySet': [{
          'action': 'query',
          'describe': '查询',
          'defaultCheck': false
        },
        {
          'action': 'get',
          'describe': '详情',
          'defaultCheck': false
        }
        ],
        'actionList': null,
        'dataAccess': null
      },
      {
        'roleId': 'user',
        'permissionId': 'menu',
        'permissionName': '菜单管理',
        'actions': '[]',
        'actionEntitySet': [],
        'actionList': null,
        'dataAccess': null
      },

      {
        'roleId': 'user',
        'permissionId': 'order',
        'permissionName': '订单管理',
        'actions': '[{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"}]',
        'actionEntitySet': [{
          'action': 'query',
          'describe': '查询',
          'defaultCheck': false
        },
        {
          'action': 'get',
          'describe': '详情',
          'defaultCheck': false
        }
        ],
        'actionList': null,
        'dataAccess': null
      },
      {
        'roleId': 'user',
        'permissionId': 'permission',
        'permissionName': '权限管理',
        'actions': '[]',
        'actionEntitySet': [],
        'actionList': null,
        'dataAccess': null
      },
      {
        'roleId': 'user',
        'permissionId': 'role',
        'permissionName': '角色管理',
        'actions': '[]',
        'actionEntitySet': [],
        'actionList': null,
        'dataAccess': null
      },

      {
        'roleId': 'user',
        'permissionId': 'test',
        'permissionName': '测试权限',
        'actions': '[]',
        'actionEntitySet': [],
        'actionList': null,
        'dataAccess': null
      },
      {
        'roleId': 'user',
        'permissionId': 'user',
        'permissionName': '用户管理',
        'actions': '[]',
        'actionEntitySet': [],
        'actionList': null,
        'dataAccess': null
      }
      ]
    }
    ],
    'pageSize': 10,
    'pageNo': 0,
    'totalPage': 1,
    'totalCount': 5
  }
}

const serverList = {
  url: apiUrl.service,
  response: function (req) {
    const totalCount = 5701
    const result = []
    const pageNo = parseInt(req.pageNo)
    const pageSize = parseInt(req.pageSize)
    const totalPage = Math.ceil(totalCount / pageSize)
    const key = (pageNo - 1) * pageSize
    const next = (pageNo >= totalPage ? (totalCount % pageSize) : pageSize) + 1

    for (let i = 1; i < next; i++) {
      const tmpKey = key + i
      result.push({
        key: tmpKey,
        id: tmpKey,
        no: 'No ' + tmpKey,
        description: '这是一段描述',
        callNo: Mock.mock('@integer(1, 999)'),
        status: Mock.mock('@integer(0, 3)'),
        updatedAt: Mock.mock('@datetime'),
        editable: false
      })
    }

    return {
      pageSize: pageSize,
      pageNo: pageNo,
      totalCount: totalCount,
      totalPage: totalPage,
      data: result
    }
  }
}


export default [
  orgTree,
  role,
  serverList
]