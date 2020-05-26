const Sell = require("../../models/sell");
const Product = require("../../models/product");

module.exports = {
  indexSell: (req, res) => {
    let products = Product.all()

    res.render("thor/sell/index", {
      products
    });
  },

  storeSell: (req, res) => {
    let totalPrice = parseInt(req.body.total_price || 0)
    let pay = parseInt(req.body.pay || 0)
    let inDebt = parseInt(req.body.in_debt || 0)
    let note = req.body.note
    let productInfo = JSON.parse(req.body.productInfo)

    try {
      productInfo.forEach(product => {
        Product.sold(product.id, product.qty)
      });

      Sell.save({
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
    let totalRecord = Sell.totalRecord()
    let totalPage = totalRecord / 2
    let page = parseInt(req.query.p || 1)
    let sold = Sell.paginate(page)
    let products = Product.all()

    res.render("thor/sell/sold", { products, sold: [...sold].reverse(), totalPage, currentPage: page });
  },

  // editCategory: (req, res) => {

  // },

  // updateCategory: (req, res) => {

  // },
  // deleteCategory: (req, res) => {

  // }
};