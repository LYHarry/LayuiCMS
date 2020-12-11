// 表单验证规则
import regexConst from './regexConst'



export const validatePhone = (rule, value, callback) => {
    console.log("regexConst ", regexConst);
};


// export default {
//     //手机号验证
//     validatePhone(rule, value, callback) {
//         console.log('regexConst ', regexConst)
//         // if (value == undefined || value == "") {
//         //     //运费券可为空
//         //     if (rule.field == "freightMoney") return callback();
//         //     return callback("请输入金额");
//         // }
//         // let money = parseFloat(value);
//         // if (isNaN(money)) return callback("请输入正确金额");
//         // //验证小数位数
//         // if (rule.field == "discountMoney") {
//         //     //折扣券验证
//         //     if (!/^(\d*|(\d*\.\d{1,1}))$/.test(value))
//         //         return callback("折扣最多保留一位小数");
//         //     if (money < 1 || money >= 10) return callback("折扣只能在1~10之间");
//         // } else {
//         //     if (!/^(\d*|(\d*\.\d{1,2}))$/.test(value))
//         //         return callback("金额最多保留两位小数");
//         //     //满减券验证
//         //     if (rule.field == "reduceMoney") {
//         //         let fullMoney = parseFloat(this.form.getFieldValue("fullMoney"));
//         //         if (isNaN(fullMoney)) return callback("请先输入满足减免的金额");
//         //         if (money >= fullMoney)
//         //             return callback("减的金额不能大于满足条件金额");
//         //     }
//         // }
//         // return callback();
//     },

// }