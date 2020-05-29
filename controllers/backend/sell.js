const Sell = require("../../models/sell");
const Product = require("../../models/product");
const User = require("../../models/user");
const { ITEM_PER_PAGE } = require('../../utils/constant')
const DateHelper = require('../../utils/date')
const { stringToSlug } = require('../../utils/string')

let totalRecord = 0
let totalPage = 0

function paginate(data, page, status, date, keyword) {
  let sold = data

  if (status) {
    sold = sold.filter(item => {
      return status === 1 ? item.inDebt > 0 : item.inDebt <= 0
    })
  }

  if (date) {
    sold = sold.filter(item => {
      return DateHelper.equalDate(item.createdAt, date)
    })
  }

  if (keyword) {
    let ids = getIdsFromName(keyword)

    if (ids.length) {
      sold = sold.filter(item => {
        return ids.includes(parseInt(item.userId || 0))
      })
    }
  }

  totalRecord = sold.length
  totalPage = Math.ceil(totalRecord / ITEM_PER_PAGE)

  if (!page || page === 1) {
    sold = sold.slice(-ITEM_PER_PAGE)
  } else {
    sold = sold.slice(page * -ITEM_PER_PAGE, (page * -ITEM_PER_PAGE) + ITEM_PER_PAGE)
  }

  return sold.length ? sold : []
}

function getIdsFromName(name) {
  let users = User.all()

  let result = users.filter(user => {
    return stringToSlug(user.name).includes(stringToSlug(name))
  })

  if (!result.length) return []

  return result.reduce((ids, user) => {
    ids.push(user.id)
    return ids
  }, [])
}


module.exports = {
  indexSell: (req, res) => {
    let products = Product.all()
    let users = User.all()

    res.render("thor/sell/index", { products, users });
  },

  storeSell: (req, res) => {
    let totalPrice = parseInt(req.body.total_price || 0)
    let pay = parseInt(req.body.pay || 0)
    let inDebt = parseInt(req.body.in_debt || 0)
    let note = req.body.note
    let userId = parseInt(req.body.userId || 0)
    let productInfo = JSON.parse(req.body.productInfo)

    try {
      productInfo.forEach(product => {
        Product.sold(product.id, product.qty)
      });

      Sell.save({
        userId,
        totalPrice,
        pay,
        inDebt,
        note,
        productInfo,
      })
    } catch (error) {
      console.log(error)
    }

    return res.redirect('/thor/sell')
  },

  indexSold: (req, res) => {
    let keyword = req.query.keyword || ''
    let status = parseInt(req.query.status || 0) || ''
    let date = req.query.date || ''

    let page = parseInt(req.query.p || 1)
    let sold = Sell.paginateRaw()
    sold = paginate(sold, page, status, date, keyword)

    let products = Product.all()
    let users = User.all()

    res.render("thor/sell/sold", {
      products,
      users,
      sold: [...sold].reverse(),
      totalPage,
      currentPage: page,
      keyword,
      status,
      date
    });
  },

  // editCategory: (req, res) => {

  // },

  // updateCategory: (req, res) => {

  // },
  // deleteCategory: (req, res) => {

  // }
};