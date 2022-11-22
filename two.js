"use strict";

function tagColor(tags) {
    let colors = {}
    for (let i = 0; i < tags.length; i++) {
        colors[tags[i].tagname] = `hsl(` + Math.floor(Math.random() * (355)) + `,` + Math.floor(Math.random() * (10) + 90) + `%,` + Math.floor(Math.random() * (20) + 30) + `%)`
    }
    return colors;
}

function tagRender(key, tagColor) {
    let tagContainer = document.querySelector("#tagContainer")
    try {
        tagContainer.innerHTML = ``
    } catch (e) {
        null
    }
    let user = JSON.parse(localStorage.getItem(key.userName))
    user.tags = user.tags.filter((i) => { return !(i.completed === i.total) })
    for (let i = 0; i < user.tags.length; i++) {
        let pw = Math.floor(user.tags[i].completed / user.tags[i].total * 100) + '%'
        let tag = document.createElement("div")
        tag.style.backgroundColor = tagColor[user.tags[i].tagname]
        tag.classList.add('flex', 'flex-col', 'p-2', 'rounded-md', 'space-y-1', 'text-white', 'drop-shadow-md', 'flex-shrink-0')
        tag.innerHTML = `
        <a class="capitalize" id="tag-${i} ">#${user.tags[i].tagname}</a>
        <a">${user.tags[i].completed} of ${user.tags[i].total} completed</a>
        <div class="w-full h-0.5 bg-black -z-10 " id="progess-bar-${i}">
            <div class="h-0.5 bg-white" style="width:${pw};" id="progress-${i}"></div>
        </div>`
        tagContainer.appendChild(tag)
        tag.addEventListener('click', () => {
            let newnotes = []
            user.notes.forEach((v2) => {
                v2.tags.forEach((v3) => {
                    if (user.tags[i].tagname === v3) {
                        newnotes.push(v2)
                        return;
                    }
                })
            })
            noteRender(key, tagColor, newnotes)
        })
    }
}

function noteRender(key, tagcolor, notes) {
    let noteContainer = document.querySelector("#noteContainer")
    try {
        noteContainer.innerHTML = ``
    } catch (e) {
        null
    }
    for (let i = 0; i < notes.length; i++) {
        let note = document.createElement('li')
        note.id = `note-${notes[i].id}`
        const noteTime = new Date(notes[i].date)
        const month = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]
        let day = noteTime.getDate().toString() + ',' + month[noteTime.getMonth()];
        let time = noteTime.getHours().toString() + ':' + noteTime.getMinutes().toString()
        note.classList.add('bg-white', 'p-2', 'drop-shadow-sm', 'rounded-md', 'flex', 'justify-between', 'px-4', 'items-center', 'space-x-2')
        note.innerHTML = `<div class="flex text-white" >
            <input placeholder="&#8203;" type="checkbox" id="chk-${notes[i].id}" class="hidden ">
            <label for="chk-${notes[i].id}" id="ptag-${notes[i].id}"><span class="p-1 material-symbols-outlined drop-shadow-sm rounded-full text-xs bg-yellow-400 border-2 cursor-pointer hover:bg-yellow-500 ">hourglass_top</span></label>
            <label for="chk-${notes[i].id}" id="dtag-${notes[i].id}" class="hidden"><span class="p-1 material-symbols-outlined drop-shadow-sm text-white rounded-full bg-green-400 text-xs cursor-pointer border-2 hover:bg-green-500 ">check</span></label>
        </div>
        <div class="wordwrap truncate relative -top-0.5 w-[64rem] text-center" id="note-done-${notes[i].id}">${notes[i].title}</div>
        <div class="flex flex-col">
            <a class="font-medium text-base">${time}</a>
            <a class="text-sm font-light capitalize">${day}</a>
        </div>
        <div class="text-xs capitalize">
            <ul class="h-10 overflow-hidden space-y-1" id="ntag-${notes[i].id}">
            </ul>
        </div>`
        noteContainer.appendChild(note)
        note.querySelector(`#note-done-${notes[i].id}`).addEventListener("click", () => {
            renderAdd(key, tagcolor, notes[i])
        }, false)

        let noteTagContainer = document.querySelector(`#ntag-${notes[i].id}`)
        for (let j = 0; j < notes[i].tags.length; j++) {
            let notTag = document.createElement('li')
            notTag.classList.add("smtag")
            notTag.style.backgroundColor = tagcolor[notes[i].tags[j]]
            notTag.innerText = `${notes[i].tags[j]}`
            noteTagContainer.appendChild(notTag)
        }
        const data = notes[i];
        document.querySelector(`#chk-${notes[i].id}`).addEventListener('change', (event) => {
            let user = JSON.parse(localStorage.getItem(key.userName))
            let index
            if (event.target.checked) {
                document.querySelector(`#note-done-${notes[i].id}`).classList.add('strike')
                document.querySelector(`#ptag-${notes[i].id}`).classList.add("hidden")
                document.querySelector(`#dtag-${notes[i].id}`).classList.remove("hidden")
                user.notes = user.notes.filter((j, ind) => {
                    index = ind
                    return !(j.id === data.id)
                })
                data.tags.forEach((k) => {
                    user.tags.forEach((l, j) => {
                        if (k === l.tagname) {
                            user.tags[j].completed++
                        }
                    })
                })
            } else {
                document.querySelector(`#dtag-${notes[i].id}`).classList.add("hidden")
                document.querySelector(`#ptag-${notes[i].id}`).classList.remove("hidden")
                document.querySelector(`#note-done-${notes[i].id}`).classList.remove('strike')
                user.notes.splice(index, 0, data)
                data.tags.forEach((k) => {
                    user.tags.forEach((l, j) => {
                        if (k === l.tagname) {
                            user.tags[j].completed--
                        }
                    })
                })
            }
            localStorage.setItem(key.userName, JSON.stringify({
                password: key.password,
                notes: user.notes,
                tags: user.tags,
            }))
            tagRender(key, tagcolor)
        })
    }
}

function addLeadingZeros(n) {
    if (n <= 9) {
        return "0" + n;
    }
    return n
}

let clickEvent = new MouseEvent("click", {
    "view": window,
    "bubbles": false,
    "cancelable": false
});

function renderAdd(key, tagcolor, note = null) {
    let user = JSON.parse(localStorage.getItem(key.userName))
    let addpage = document.querySelector("#addpage")
    addpage.classList.remove("hidden")
    let date = addpage.querySelector("#dtl")
    let currentDatetime = new Date()
    let curdatetimestr = currentDatetime.getFullYear() + "-" + addLeadingZeros(currentDatetime.getMonth() + 1) + "-" + addLeadingZeros(currentDatetime.getDate()) + "T" + addLeadingZeros(currentDatetime.getHours()) + ":" + addLeadingZeros(currentDatetime.getMinutes())
    date.value = curdatetimestr
    let text = addpage.querySelector("#textdata")
    let title = addpage.querySelector("#notename")
    let id = addpage.querySelector("#noteid")
    if (note != null) {
        title.setAttribute('value', note.title)
        text.value = note.text
        let n = new Date(note.date)
        let nstr = n.getFullYear() + "-" + addLeadingZeros(n.getMonth() + 1) + "-" + addLeadingZeros(n.getDate()) + "T" + addLeadingZeros(n.getHours()) + ":" + addLeadingZeros(n.getMinutes())
        date.value = nstr
        id.value = note.id
    }
    addpage.querySelector("#closenote").replaceWith(addpage.querySelector("#closenote").cloneNode(true))
    addpage.querySelector("#savenote").replaceWith(addpage.querySelector("#savenote").cloneNode(true))
    addpage.querySelector("#closenote").addEventListener("click", (event) => {
        title.value = ''
        text.value = ''
        date.value = curdatetimestr
        addpage.classList.add("hidden")
        event.target.replaceWith(event.target.cloneNode(true))
    })
    addpage.querySelector("#savenote").addEventListener("click", (event) => {
        if (note === null) text.value = text.value + " #all"
        if (title.value === "" || title.value === null) title.value = "ToDo-" + user.notes.length
        let arr = text.value.match(/\B#([a-z0-9]{2,})(?![~!@#$%^&*()=+_`\-\|\/'\[\]\{\}]|[?.,]*\w)/gmi)
        arr = arr.filter((item, index) => { return arr.indexOf(item) === index })
        arr.forEach((_, i) => arr[i] = arr[i].substring(1))
        let rendertags = []
        if (note === null) {
            arr.forEach((i1) => {
                let userindex = user.tags.findIndex(x => x.tagname === i1)
                if (userindex === -1) {
                    rendertags.push({ tagname: i1 })
                    user.tags.push({
                        tagname: i1,
                        total: 1,
                        completed: 0
                    })
                } else {
                    user.tags[userindex].total++
                }
            })
            let check = () => {
                id.value = Math.random().toString(16).substring(2)
                if (user.notes.findIndex((x) => id.value === x.id) === -1) return;
                check()
            }
            check()
            user.notes.push({
                title: title.value,
                text: text.value,
                tags: arr,
                id: id.value,
                date: date.value,
            })

        } else {
            let index = user.notes.findIndex(x => x.id === id.value)
            let originalNoteTags = user.notes[index].tags
            let addedNotes = originalNoteTags.filter(function(item) {
                return arr.indexOf(item) === -1
            })
            let deletedNotes = arr.filter(function(item) {
                return originalNoteTags.indexOf(item) === -1
            })
            addedNotes.forEach((i1) => {
                let userindex = user.tags.findIndex(x => x.tagname === i1)
                if (userindex === -1) {
                    rendertags.push({ tagname: i1 })
                    user.tags.push({
                        tagname: i1,
                        total: 1,
                        completed: 0
                    })
                } else {
                    user.tags[userindex].total++
                }
            })
            deletedNotes.forEach((i1) => {
                let userindex = user.tags.findIndex(x => x.tagname === i1)
                if (userindex !== -1) {
                    user.tags[userindex].total--
                }
                if ((user.tags[userindex].total === 0) || (user.tags[userindex].total === user.tags[userindex].completed)) user.tags.splice(userindex, 1)
            })
            user.notes[index].text = text.value
            user.notes[index].title = title.value
            user.notes[index].date = date.value
            user.notes[index].notes = arr
        }
        user.tags = user.tags.filter((x) => {
            return x.total != x.completed
        })
        localStorage.setItem(key.userName, JSON.stringify({
            password: key.password,
            notes: user.notes,
            tags: user.tags,
        }))
        tagcolor = Object.assign(tagcolor, tagColor(rendertags))
        tagRender(key, tagcolor)
        noteRender(key, tagcolor, user.notes)
        addpage.querySelector("#closenote").dispatchEvent(clickEvent)
        event.target.replaceWith(event.target.cloneNode(true))
    })
}

function addtime(day, date = new Date()) {
    date.setDate(date.getDate() + day)
    return date
}

function throttle(cb, delay = 1000) {
    let shouldWait = false
    let waitingArgs
    const timeoutFunc = () => {
        if (waitingArgs === null) {
            shouldWait = false
        } else {
            cb(...waitingArgs)
            waitingArgs = null
            setTimeout(timeoutFunc, delay)
        }
    }
    return (...args) => {
        if (shouldWait) {
            waitingArgs = args
            return
        }

        cb(...args)
        shouldWait = true

        setTimeout(timeoutFunc, delay)
    }
}

let sel = (key, tagColor, event) => {
    event.querySelectorAll('.sel').forEach((i) => i.classList.remove('hidden'))
    event.querySelectorAll('.unsel').forEach((i) => i.classList.add('hidden'))
    let date = event.getAttribute('value')
    if (date === null) { return; }
    let user = JSON.parse(localStorage.getItem(key.userName))
    let dateo2 = new Date(date)
    user.notes = user.notes.filter(i => {
        let dateo1 = new Date(i.date)
        return dateo1.getTime() <= dateo2.getTime()
    })
    noteRender(key, tagColor, user.notes)
}

let unsel = (event) => {
    event.querySelectorAll('.unsel').forEach((i) => i.classList.remove('hidden'))
    event.querySelectorAll('.sel').forEach((i) => i.classList.add('hidden'))
}


window.onload = () => {
    let signup = document.querySelector("#s")
    signup.querySelector("#signup").addEventListener("click", () => {
        let key = {
            userName: signup.querySelector("#s-user").value,
            password: signup.querySelector("#s-password").value
        }
        if (localStorage.getItem(key.userName) != null) {
            alert("user already exists!!")
        } else {
            localStorage.setItem(key.userName, JSON.stringify({
                password: key.password,
                notes: [],
                tags: [],
            }))
            alert("user added : you can login now")
        }
    })
    let login = document.querySelector("#l")
    login.querySelector("#login").addEventListener("click", () => {
        let key = {
            userName: login.querySelector("#l-user").value,
            password: login.querySelector("#l-password").value
        }
        let user = JSON.parse(localStorage.getItem(key.userName))
        if (user===null){
            alert("user does not exist")
            return
        }

        user.tags = user.tags.filter((x) => {
            //make so that none existing are also removed
            return x.total != x.completed
        })
        localStorage.setItem(key.userName, JSON.stringify({
            password: key.password,
            notes: user.notes,
            tags: user.tags,
        }))
        if (user != null) {
            if (key.password === user.password) {
                document.querySelector("#title").innerText = `what 's up ${key.userName}`
                let search = document.querySelector("#searchbar")
                let head = document.querySelector("#head")
                document.querySelector("#searchbtn").addEventListener("click", () => {
                    head.classList.add("hidden")
                    search.classList.remove("hidden")
                })
                document.querySelector("#searchbar").querySelector("#searchclose").addEventListener("click", () => {
                    search.querySelector("#n-search").value = ""
                    search.classList.add("hidden")
                    head.classList.remove("hidden")
                })

                let dates = [
                    document.querySelector("#today"),
                    document.querySelector("#week"),
                    document.querySelector("#month"),
                    document.querySelector("#datetime")
                ]

                let datesarr = [0, 7, 30]
                dates.forEach((i, ind) => {
                    if (ind === 3) {
                        return;
                    }
                    i.setAttribute('value', addtime(datesarr[ind]).toString())
                })

                document.querySelector("#dtlsearch").addEventListener('change', (event) => {
                    let setdate = new Date(event.target.value)
                    dates[3].setAttribute('value', setdate.toString())
                    dates[3].dispatchEvent(clickEvent)
                }, true)

                let tagcolor = tagColor(user.tags)

                let con = throttle((sub) => {
                    if (sub.value === "") {
                        noteRender(key, tagcolor, user.notes)
                        return
                    }
                    let notes = user.notes.filter((x) => x.text.includes(sub.value) || x.title.includes(sub.value))
                    noteRender(key, tagcolor, notes)
                }, 500)

                document.querySelector("#n-search").addEventListener("input", (event) => {
                    con(event.target)
                })

                dates.forEach((i, ind, r) => {
                    let filtered = r.filter((j) => { return i != j })
                    i.addEventListener("click", () => {
                        sel(key, tagcolor, i)
                        filtered.forEach(element => {
                            unsel(element)
                        });
                    }, true)
                })

                tagRender(key, tagcolor)
                noteRender(key, tagcolor, user.notes)
                document.querySelector("#addnew").addEventListener("click", () => {
                    renderAdd(key, tagcolor);
                })

                document.querySelector("#lsbox").classList.add("hidden")
            } else {
                alert("user does not exists")
            }
        } else {
            alert("user does not exists")
        }
    })
    let selector = document.querySelector("#selector")
    selector.querySelector("#btn-signup").addEventListener("click", (self) => {
        self.target.classList.add("bg-blue-400", "hover:bg-blue-500")
        selector.querySelector("#btn-login").classList.remove("bg-blue-400", "bg-blue-500")
        signup.classList.remove("hidden")
        login.classList.add("hidden")
    });
    selector.querySelector("#btn-login").addEventListener("click", (self) => {
        self.target.classList.add("bg-blue-400", "hover:bg-blue-500")
        selector.querySelector("#btn-signup").classList.remove("bg-blue-400", "bg-blue-500")
        login.classList.remove("hidden")
        signup.classList.add("hidden")
    })
    selector.querySelector("#btn-signup").classList.add("bg-blue-400", "hover:bg-blue-500")
}