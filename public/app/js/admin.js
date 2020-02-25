document.addEventListener('DOMContentLoaded', () => {
    const url = "http://localhost:4000/admin/"

    // show add modal
    const btnShowProductModal = document.getElementById('btnShowProductModal')
    btnShowProductModal.addEventListener('click',()=>{
        $('#add_modal').modal('show')
    })

    const btnAddProduct = document.getElementById('btnAddProduct')
    btnAddProduct.addEventListener('click',()=>{
        const _csrf = document.getElementById('_csrf').value
        const productname = document.getElementById('add_product_name').value
        const productprice = document.getElementById('add_product_price').value
        const producttotal = document.getElementById('add_product_total').value
        const productcategory = document.getElementById('add_product_category').value
        const productdescription = document.getElementById('add_product_description').value
        const data = JSON.stringify({
            '_csrf': _csrf, 'productname': productname, 'productprice': productprice,
            'producttotal': producttotal, 'productcategory': productcategory,
            'productdescription': productdescription
        })
        $.ajax({
            url: url + "products",
            type: 'POST',
            contentType: 'application/json',
            data: data,
            success: function (result) {
                console.log(result)
                // showProducts();
                // $("#add_modal").modal("hide");
            },
            error(xhr, resp, text) {
                console.log(xhr, resp, text);
            }
        })
    })






})