let dateToFormat = document.querySelectorAll('span.date')

if (dateToFormat.length) {
  for (let i = 0; i < dateToFormat.length; ++i) {
    let date = new Date(dateToFormat[i].textContent)
    dateToFormat[i].textContent = date.toLocaleDateString('en-US')
  }
}
