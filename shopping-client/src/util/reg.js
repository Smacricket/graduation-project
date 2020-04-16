// 用户名校验
export const validateName = (rule, value, callback) => {
  if (!/^(?![0-9]*$)(?![a-zA-Z]*$)[a-zA-Z0-9]{6,20}$/.test(value)) {
    callback(new Error("账号必须为6-20位字母和数字组合"));
  } else {
    callback();
  }
};

// 密码校验
export const validatePass = (rule, value, callback) => {
  if (
    !/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)([^\u4e00-\u9fa5\s]){6,20}$/.test(
      value
    )
  ) {
    callback(
      new Error("请输入6-20位英文字母、数字或者符号（除空格），至少包含两种")
    );
  } else {
    callback();
  }
};

// 密码强度校验
// 强
export const strongRegex = new RegExp(
  "^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$",
  "g"
);
// 中
export const mediumRegex = new RegExp(
  "^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$",
  "g"
);
// 弱
export const enoughRegex = new RegExp("(?=.{6,}).*", "g");

// 手机号码校验
export function validatePhone(rule, value, callback) {
  const reg = /^[1][3-9][0-9]{9}$/;
  if (value == "" || value == undefined || value == null) {
    callback();
  } else {
    if (!reg.test(value) && value != "") {
      callback(new Error("请输入正确的电话号码"));
    } else {
      callback();
    }
  }
}

// 邮箱校验
export function validateEMail(rule, value, callback) {
  const reg = /^([a-zA-Z0-9]+[-_.]?)+@[a-zA-Z0-9]+\.[a-z]+$/;
  if (value == "" || value == undefined || value == null) {
    callback();
  } else {
    if (!reg.test(value)) {
      callback(new Error("请输入正确的邮箱"));
    } else {
      callback();
    }
  }
}
