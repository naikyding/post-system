export function validatePasswordType1(password) {
  // 至少 8 碼，至少一個大寫、一個小寫、一個特殊字元
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/

  return regex.test(password)
}
// // 測試
// console.log(validatePassword("Abcdef!1")) // true
// console.log(validatePassword("abcdef!1")) // false (缺大寫)
// console.log(validatePassword("ABCDEF!1")) // false (缺小寫)
// console.log(validatePassword("Abcdefgh")) // false (缺特殊字元)

export function validatePasswordType2(password) {
  // 至少 8 碼，至少一個英文字母 (大小寫皆可)，至少一個特殊符號
  const regex = /^(?=.*[A-Za-z])(?=.*[^A-Za-z0-9]).{8,}$/

  return regex.test(password)
}
// 測試
// console.log(validatePassword('abc!1234')) // true
// console.log(validatePassword('Abcdefgh')) // false (缺特殊符號)
// console.log(validatePassword('!!!!!!!!!')) // false (缺英文字母)
