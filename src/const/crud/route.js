const DIC = {
  vaild: [
    {
      label: '是',
      value: '1'
    },
    {
      label: '否',
      value: '0'
    }
  ]
}
export const tableOption = {
  'border': false,
  'index': true,
  'stripe': true,
  'menuAlign': 'center',
  'align': 'center',
  'editBtn': false,
  'delBtn': false,
  'addBtn': false,
  'dic': [],
  'column': [{
    width: 150,
    label: '编号',
    prop: 'id',
    align: 'center',
    sortable: true,
    hide: true,
    editDisabled: true,
    addVisdiplay: false
  }, {
    width: 150,
    label: '服务名称',
    prop: 'serviceId',
    align: 'center',
    sortable: true,
    fixed: true,
    span: 12,
    rules: [{
      required: true,
      message: '请输入服务名称',
      trigger: 'blur'
    }]
  }, {
    label: '匹配路径',
    prop: 'path',
    align: 'center',
    span: 12,
    width: 150
  }, {
    label: '转发地址',
    prop: 'url',
    hide: true,
    span: 24,
    align: 'center',
    width: 150
  },
  {
    label: '敏感头',
    prop: 'sensitiveheadersList',
    align: 'center',
    width: 200,
    span: 24
  }, {
    label: '去掉前缀',
    prop: 'stripPrefix',
    align: 'center',
    width: 150,
    type: 'radio',
    dicData: DIC.vaild,
    valueDefault: '1',
    rules: [{
      required: true,
      message: '是否去掉前缀',
      trigger: 'blur'
    }]
  }, {
    label: '是否重试',
    prop: 'retryable',
    align: 'center',
    width: 150,
    type: 'radio',
    dicData: DIC.vaild,
    valueDefault: '1',
    rules: [{
      required: true,
      message: '是否重试',
      trigger: 'blur'
    }]
  }, {
    label: '是否启用',
    prop: 'enabled',
    align: 'center',
    width: 150,
    type: 'radio',
    dicData: DIC.vaild,
    valueDefault: '1',
    rules: [{
      required: true,
      message: '是否启用',
      trigger: 'blur'
    }]
  }, {
    label: '创建时间',
    prop: 'createTime',
    format: 'YYYY-MM-DD hh:mm:ss',
    valueFormat: 'YYYY-MM-DD hh:mm:ss',
    type: 'date',
    align: 'center',
    editVisdiplay: false,
    addVisdiplay: false,
    width: 200
  }]
}
