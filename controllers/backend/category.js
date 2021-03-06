const Category = require('../../models/category')
const Product = require('../../models/product')

module.exports = {
  indexCategory: (req, res) => {
    const categories = Category.all()

    res.render('thor/category/index', {
      categories,
      errorMsg: req.flash('error') || '',
      successMsg: req.flash('success') || '',
    })
  },

  createCategory: (req, res) => {
    res.render('thor/category/create')
  },

  storeCategory: (req, res) => {
    let name = req.body.name || ''
    if (!name) return res.redirect('/thor/category/create')

    let category = Category.save(name)
    req.flash('success', 'Thêm loại sản phẩm thành công!')

    return category ? res.redirect('/thor/category') : res.redirect('/thor/category/create')
  },

  editCategory: (req, res) => {
    let id = req.params.id || ''

    let category = Category.findById(id)
    if (!category) {
      return res.redirect('/thor/category')
    }

    return res.render('thor/category/edit', {
      category
    })
  },

  updateCategory: (req, res) => {
    let id = req.params.id || ''
    let name = req.body.name || ''

    if (!id || !name) {
      res.redirect('/thor/category')
    }

    let category = Category.update(id, name)

    if (!category) {
      req.flash('error', 'Oops! có vẻ không update được rồi @@')

      return res.redirect('/thor/category')
    }
    req.flash('success', 'Cập nhật loại sản phẩm thành công!')

    return res.redirect('/thor/category')
  },

  deleteCategory: (req, res) => {
    let id = req.params.id || ''

    const products = Product.findByCategoryId(id)
    if (products.length) {
      req.flash('error', 'Oops! Loại sản phẩm này đang được sử dụng nên không thể xóa! :(')

      return res.redirect('/thor/category')
    }

    //TODO: implement fail case
    Category.remove(id)
    req.flash('success', 'Xóa loại sản phẩm thành công!')

    return res.redirect('/thor/category')
  }
}