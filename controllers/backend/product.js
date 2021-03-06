const Product = require('../../models/product')
const Category = require('../../models/category')
const uploadModule = require('../../utils/upload')
const { AMOUNT_OF_WARNING } = require('../../utils/constant')
const { stringToSlug } = require('../../utils/string')

const getProductStatus = (product) => {
  let status = {}

  if (product.stock > AMOUNT_OF_WARNING) {
    status.text = 'Đang còn'
    status.class = 'chip-success'
  } else if (product.stock <= AMOUNT_OF_WARNING && product.stock > 0) {
    status.text = 'Sắp hết'
    status.class = 'chip-warning'
  } else {
    status.text = 'Hết hàng'
    status.class = 'chip-danger'
  }

  return status
}

const generateExpiryDate = () => {
  const date = new Date()
  const y = date.getFullYear()
  const m = ('0' + (date.getMonth() + 2)).slice(-2)
  const d = ('0' + date.getDate()).slice(-2)

  return `${y}-${m}-${d}`
}

const getAllProduct = () => {
  let products = Product.all()

  products = products.map(product => {
    let tempProduct = {
      ...product
    }
    tempProduct.status = getProductStatus(tempProduct)

    return tempProduct
  })

  return products
}

module.exports = {
  indexProduct: (req, res) => {
    let keyword = req.query.keyword || ''
    let status = parseInt(req.query.status) || 0
    let products = getAllProduct()
    products = products.filter(product => stringToSlug(product.name).includes(stringToSlug(keyword)))

    if(status === 1) {
      products = products.filter(product => product.stock === 0)
    } else if(status === 2){
      products = products.filter(product => product.stock <= AMOUNT_OF_WARNING && product.stock > 0)
    }

    res.render('thor/product/index', {
      products,
      keyword,
      status,
      errorMsg: req.flash('error') || '',
      successMsg: req.flash('success') || '',
    })
  },

  createProduct: (req, res) => {
    const categories = Category.all()

    res.render('thor/product/create', {
      categories
    })
  },

  storeProduct: (req, res) => {
    let uploadFile = uploadModule.single('image')

    uploadFile(req, res, (error) => {
      if (error) {
        console.log(`Error: ${error}`)

        return res.redirect('/thor/product/create')
      }

      let categoryId = req.body.categoryId || ''
      let name = req.body.name || ''
      let stock = parseInt(req.body.stock || 0)
      let price = parseInt(req.body.price || 1000)
      let expiryAt = req.body.expiryAt || generateExpiryDate()
      let image = req.body.fileUploadName

      if (!name) return res.redirect('/thor/product/create')

      let product = Product.save({
        name,
        stock,
        price,
        expiryAt,
        categoryId,
        image
      })

      if (product) {
        req.flash('success', 'Thêm sản phẩm thành công!')
      } else {
        req.flash('error', 'Không thể tạo sản phẩm')
      }

      return product ? res.redirect('/thor/product') : res.redirect('/thor/product/create')
    })
  },

  editProduct: (req, res) => {
    const categories = Category.all()
    if (!req.params.id) {
      return res.redirect('/thor/product')
    }

    const product = Product.findById(req.params.id)

    res.render('thor/product/edit', {
      categories,
      product
    })
  },

  updateProduct: (req, res) => {
    let handleFileUpload = uploadModule.single('image')

    handleFileUpload(req, res, (error) => {
      if (error) {
        console.log(`Error: ${error}`)

        return res.redirect('/thor/product/edit/' + req.params.id)
      }

      let categoryId = req.body.categoryId || ''
      let id = req.params.id || ''
      let name = req.body.name || ''
      let stock = parseInt(req.body.stock || 0)
      let price = parseInt(req.body.price || 1000)
      let expiryAt = req.body.expiryAt || generateExpiryDate()
      let image = req.body.fileUploadName || null

      if (!name) return res.redirect('/thor/product/product')

      let dataUpdate = {
        name,
        stock,
        price,
        expiryAt,
        categoryId
      }
      if (image) {
        dataUpdate.image = image
      }

      let product = Product.update(id, dataUpdate)

      if (product) {
        req.flash('success', 'Cập nhật sản phẩm thành công!')
      } else {
        req.flash('error', 'Không thể cập nhật thông tin sản phẩm')
      }

      return product ? res.redirect('/thor/product') : res.redirect('/thor/product/edit/' + id)
    })
  },

  deleteProduct: (req, res) => {
    let id = req.params.id || ''

    //TODO: implement fail case
    Product.remove(id)

    req.flash('success', 'Xóa sản phẩm thành công!')

    return res.redirect('/thor/product')
  },

  importProduct: (req, res) => {
    if (req.method.toLowerCase() === 'get') {
      let products = getAllProduct()

      return res.render('thor/product/import', {
        products
      })
    }

    let product = Product.findById(req.body.productId)

    if (product) {
      let stock = (parseInt(req.body.stock) || 0) + product.stock
      let expiryAt = req.body.expiryAt || generateExpiryDate()

      Product.update(product.id, {
        stock,
        expiryAt
      })
      
      req.flash('success', 'Cập nhật số lượng hàng thành công!')

      return res.redirect('/thor/product')
    }

    return res.redirect('/thor/product/import')
  }
}
