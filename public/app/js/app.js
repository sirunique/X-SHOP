

// change cart Product Quantity
const changeQty = (e)=>{
    const productId = e.getAttribute('data-productId')
    const qty = e.value
    const _csrf = e.getAttribute('data-csrf')
    fetch('/changeQty/'+productId,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "qty":qty,
            "_csrf":_csrf
        })
    })
    .then((response) => response.json())
    // .then((data) =>{
    //     console.log(data)
    //     if(data.status)
    // })
    .then((data) => {
        if(data.status){
            window.location ="/cart"
        }
    })
    .catch(err=> console.log(err))
}