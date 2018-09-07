const DIC = {
  vaild: [
    {
      label: '否',
      value: 'false'
    },
    {
      label: '是',
      value: 'true'
    }
  ],
  GrantTypes: [
    {
      label: 'authorization_code',
      value: 'authorization_code'
    },
    {
      label: 'password',
      value: 'password'
    },
    {
      label: 'refresh_token',
      value: 'refresh_token'
    },
    {
      label: 'client_credentials',
      value: 'client_credentials'
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
  labelWidth: 140,
  'dic': [],
  'column': [{
    width: 150,
    label: '客户端ID',
    prop: 'clientId',
    align: 'center',
    sortable: true,
    rules: [{
      required: true,
      message: '请输入客户端ID',
      trigger: 'blur'
    }]
  }, {
    width: 150,
    label: '客户端密钥',
    prop: 'clientSecret',
    align: 'center',
    sortable: true,
    rules: [{
      required: true,
      message: '请输入客户端密钥',
      trigger: 'blur'
    }]
  }, {
    label: 'Scope',
    prop: 'scope',
    align: 'center',
    width: 150,
    rules: [{
      required: true,
      message: '请输入scope',
      trigger: 'blur'
    }]
  }, {
    label: '授权模式',
    prop: 'authorizedGrantTypes',
    align: 'center',
    width: 300,
    overHidden: true,
    span: 24,
    rules: [{
      required: true,
      message: '请输入授权模式',
      trigger: 'blur'
    }]
  }, {
    label: '回调地址',
    prop: 'webServerRedirectUri',
    align: 'center',
    width: 300,
    overHidden: true,
    type: 'input',
    span: 24
  }, {
    label: '令牌有效时间(毫秒)',
    prop: 'accessTokenValidity',
    align: 'center',
    width: 150,
    hide: true,
    rules: [{
      validator: (rule, value, callback) => {
        if (value === '') {
          callback()
        } else {
          if (!/^[1-9]\d*$/.test(value)) {
            callback(new Error('只能输入正整数'))
          } else {
            callback()
          }
        }
      },
      trigger: 'blur'
    }]
  }, {
    label: '令牌刷新时间(毫秒)',
    prop: 'refreshTokenValidity',
    align: 'center',
    width: 150,
    hide: true,
    rules: [{
      validator: (rule, value, callback) => {
        if (value === '') {
          callback()
        } else {
          if (!/^[1-9]\d*$/.test(value)) {
            callback(new Error('只能输入正整数'))
          } else {
            callback()
          }
        }
      },
      trigger: 'blur'
    }]
  }, {
    label: '扩展信息',
    prop: 'additionalInformation',
    align: 'center',
    width: 150,
    hide: true
  }, {
    label: '自动放行',
    prop: 'autoapprove',
    align: 'center',
    type: 'radio',
    valueDefault: 'false',
    dicData: DIC.vaild,
    width: 150,
    rules: [{
      required: true,
      message: '请选择是否放行',
      trigger: 'blur'
    }]
  }]
}
