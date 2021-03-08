export const newTreeData = [
    {
        id: 'a',
        title: 'a',
        children: [
            {
                id: 'a1',
                title: 'a-1',
                children: [
                    {
                        id: 112,
                        title: '1-1-2'
                    },
                    {
                        id: 'a12',
                        title: 'a-1-2'
                    },
                    {
                        id: 'a13',
                        title: 'a-1-3'
                    },
                    {
                        id: 'a14',
                        title: 'a-1-4'
                    }
                ]
            },
            {
                id: 'a2',
                title: 'a-2',
                children: [
                    {
                        id: 'a21',
                        title: 'b-2-1'
                    }
                ]
            }
        ]
    }
]


export const treeData = [
    {
        id: 1,
        title: '1',
        children: [
            {
                id: 11,
                title: '1-1',
                loading: false,
                children: [
                    {
                        id: 111,
                        title: '1-1-1'
                    },
                    {
                        id: 112,
                        title: '1-1-2'
                    },
                    {
                        id: 113,
                        title: '1-1-3'
                    },
                    {
                        id: 114,
                        title: '1-1-4'
                    }
                ]
            },
            {
                id: 12,
                title: '1-2',
                children: [
                    {
                        id: 121,
                        title: '1-2-1'
                    }
                ]
            }
        ]
    }
]

export const OrgData = {
    id: 0,
    label: 'XXX科技有限公司',
    children: [
        {
            id: 2,
            label: '产品研发部',
            children: [
                {
                    id: 5,
                    label: '研发-前端'
                }, {
                    id: 6,
                    label: '研发-后端'
                }, {
                    id: 9,
                    label: 'UI设计'
                }, {
                    id: 10,
                    label: '产品经理'
                }
            ]
        },
        {
            id: 3,
            label: '销售部',
            children: [
                {
                    id: 7,
                    label: '销售一部'
                }, {
                    id: 8,
                    label: '销售二部'
                }
            ]
        },
        {
            id: 4,
            label: '财务部'
        }, {
            id: 11,
            label: 'HR人事'
        }
    ]
}