let userCart = {}
let productRemoveId = null
let productRemovePrice = null
let productRemoveQty = null

$('#modalConfirmDelete').on('hidden.bs.modal', function (e) {
  productRemoveId = null
  productRemovePrice = null
  productRemoveQty = null
})

function increment(id, price) {
  let idSelector = `#f_product_qty_${id}`
  let currentQty = parseInt($(idSelector).text())
  $(idSelector).text(currentQty + 1)

  let totalPrice = parseInt($('#f_total_price').val())
  totalPrice += parseInt(price)
  $('#f_total_price').val(totalPrice)

  onChangePay()
}

function decrement(id, price) {
  let idSelector = `#f_product_qty_${id}`
  let currentQty = parseInt($(idSelector).text())

  if (currentQty > 1) {
    $(idSelector).text(parseInt(currentQty) - 1)

    let totalPrice = parseInt($('#f_total_price').val())
    totalPrice -= parseInt(price)
    $('#f_total_price').val(totalPrice)
  }

  onChangePay()
}

function remove(id, price, qty) {
  productRemoveId = id
  productRemovePrice = parseInt(price)
  productRemoveQty = parseInt(qty)
}

function deleteProduct() {
  let idSelector = `#product_${productRemoveId}`

  let totalPrice = parseInt($('#f_total_price').val())
  totalPrice -= (productRemovePrice * productRemoveQty)
  $('#f_total_price').val(totalPrice)

  $(idSelector).remove()
  $('#modalConfirmDelete').modal('hide')

  onChangePay()
}

/**
 * Handle input pay
 */
function onChangePay() {
  let pay = parseInt($('#f_pay').val()) || 0
  let totalPrice = parseInt($('#f_total_price').val())  || 0

  if (pay > totalPrice) {
    $('#f_refund').val(pay - totalPrice)
    $('#f_in_debt').val('')
  } else {
    $('#f_in_debt').val(totalPrice - pay)
    $('#f_refund').val('')
  }
}

/**
 * Set cart info to submit
 */
function setCartInfo() {
  let userCartArr = Object.values(userCart)
  
  let productInfo = []
  for (let i = 0; i < userCartArr.length; i++) {
    productInfo.push({
      id: userCartArr[i].id,
      qty: userCartArr[i].qty,
      price: userCartArr[i].price
    })
  }

  $('#productInfo').val(JSON.stringify(productInfo))
}

/**
 * Filter customer by name
 */
function onFilterUser() {
  $('#f_user')[0][0].selected = true

  let keyword = $('#f_filter_user').val().trim() || ''
  let userEls = $('#f_user')
  userEls = userEls[0]

  for (let i = 0; i < userEls.length; i++) {
    let user = userEls[i].innerText

    if (user && keyword) {
      let isContain = stringToSlug(user).includes(stringToSlug(keyword))
      
      if (isContain) {
        $(userEls[i]).addClass('is-block')
        $(userEls[i]).removeClass('is-hidden')
      } else {
        $(userEls[i]).addClass('is-hidden')
        $(userEls[i]).removeClass('is-block')
      }
    } else {
      $(userEls[i]).addClass('is-block')
      $(userEls[i]).removeClass('is-hidden')
    }
  }
}

/**
 * Convert Vietnamese character with mark
 * 
 * Source: https://gist.github.com/bluzky/b8c205c98ff3318907b30c3e0da4bf3f
 * Auth: bluzky
 * 
 * @param {String} str 
 */
function stringToSlug(str) {
  var from = "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçỳýỷỹỵ",
    to = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";

  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(RegExp(from[i], "gi"), to[i]);
  }

  str = str.toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-]/g, '-')
    .replace(/-+/g, '-');

  return str;
}