var check = document.getElementsByClassName("fa-check");
// var thumbDown = document.getElementsByClassName("fa-thumbs-down")
var trash = document.getElementsByClassName("fa-times");

Array.from(check).forEach(function(element) {
      element.addEventListener('click', function(){
        const customerName = this.parentNode.parentNode.childNodes[1].innerText
        const coffee = this.parentNode.parentNode.childNodes[3].innerText
        const toma = this.parentNode.parentNode.childNodes[5].innerText
        fetch('/completed', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'customerName': customerName,
            'coffee': coffee,
            'toma': toma,
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

// Array.from(thumbDown).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const name = this.parentNode.parentNode.childNodes[1].innerText
//         const msg = this.parentNode.parentNode.childNodes[3].innerText
//         const thumbUpCount = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
//         fetch('messagesDown', {
//           method: 'put',
//           headers: {'Content-Type': 'application/json'},
//           body: JSON.stringify({
//             'name': name,
//             'msg': msg,
//             'thumbUp':thumbUpCount,
//           })
//         })
//         .then(response => {
//           if (response.ok) return response.json()
//         })
//         .then(data => {
//           console.log(data)
//           window.location.reload(true)
//         })
//       });
// });

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        console.log('works')
        const customerName = this.parentNode.parentNode.childNodes[1].innerText
        const coffee = this.parentNode.parentNode.childNodes[3].innerText
        const toma = this.parentNode.parentNode.childNodes[5].innerText

        fetch('erase', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'customerName': customerName,
            'coffee': coffee,
            'toma': toma,
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
