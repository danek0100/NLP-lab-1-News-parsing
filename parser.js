// Набор уникальных внутренних адресов
let newsArr = new Set()
let startURL = "https://habr.com/ru/flows/marketing/news/page"
let newsUrl = "https://habr.com/ru/news/t/"
// Идентификатор таймера
let si
// Счётчик
let pageCounter = 0 
let scaner = async () => {
    // Начало работы сканера. Первичный вызов.
    if(pageCounter == 0){
        pageCounter+=1
        return console.log("---Сканирование началось---")
    }

    // Условие окончания работы сканера
    if([...newsArr].length>=1000) {
        clearInterval(si)
        console.log("---Сканирование завершено---")
		uriContent = "data:application/octet-stream," + encodeURIComponent(new Array(...newsArr).join('\n'));
		newWindow = window.open(uriContent, 'data.txt');
		return console.log(new Array(...newsArr).join(' '));
    }
    // Получение адреса для сканирования
    let scanURI = startURL + pageCounter
    console.log(`Сканируется: ${scanURI}`)
    // Выборка строки HTML-разметки с сервера
    let str = await fetch(scanURI).then(resp=>resp.text())
    let scanDoc = new DOMParser().parseFromString(str, "text/html")
    let arrHrefs = [...scanDoc.getElementsByTagName("a")].map(i=>i.href)
    let aNews = arrHrefs.filter(i=>i.includes(newsUrl)).filter(i=>!i.includes("comments"))
    aNews
      .map(i=>i.replace(/\?.+/g, "").replace(/\#.+/g, ""))
      .map(i=>newsArr.add(i))
    return pageCounter+=1

}
// Вызов сканера
si = setInterval(scaner, 50)