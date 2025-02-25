'use strict'

const {app, BrowserWindow, Menu, webContents, dialog, shell} = require('electron')
const {writeFile, readFile} = require('fs')
const fs = require('fs')
let path = require("path");
const Themes = require('../themes.js')

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            frame: false
        },
        icon: './icons/icon.ico'
    })

    mainWindow.loadFile("index.html")

    // Menu
    const template = [
        {
            label: "File",
            submenu: [
                {
                    label: "New File",
                    accelerator: "CmdOrCtrl+N",
                    click() {
                        FileFunctions.newFile()
                    },
                },
                {
                    label: "Save File",
                    accelerator: "CmdOrCtrl+S",
                    click() {
                        FileFunctions.saveFile()
                    }
                },
                {
                    label: "Save File As",
                    accelerator: "CmdOrCtrl+Shift+S",
                    click() {
                        FileFunctions.saveFileAs()
                    }
                },
                {
                    label: "Open File",
                    accelerator: "CmdOrCtrl+O",
                    click() {
                        FileFunctions.openFile()
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: "Exit",
                    accelerator: "CmdOrCtrl+E",
                    click() {
                        mainWindow.close()
                    }
                }
            ]
        },
        {
            role: 'editMenu'
        },
        {
            label: "Paragraph",
            submenu: [
                {
                    label: "Heading 1",
                    accelerator: "CmdOrCtrl+1",
                    click() {
                        ParagraphFunctions.addHeading(1)
                    }
                },
                {
                    label: "Heading 2",
                    accelerator: "CmdOrCtrl+2",
                    click() {
                        ParagraphFunctions.addHeading(2)
                    }
                },
                {
                    label: "Heading 3",
                    accelerator: "CmdOrCtrl+3",
                    click() {
                        ParagraphFunctions.addHeading(3)
                    }
                },
                {
                    label: "Heading 4",
                    accelerator: "CmdOrCtrl+4",
                    click() {
                        ParagraphFunctions.addHeading(4)
                    }
                },
                {
                    label: "Heading 5",
                    accelerator: "CmdOrCtrl+5",
                    click() {
                        ParagraphFunctions.addHeading(5)
                    }
                },
                {
                    label: "Heading 6",
                    accelerator: "CmdOrCtrl+6",
                    click() {
                        ParagraphFunctions.addHeading(6)
                    }
                },
                {
                    type: "separator"
                },
                {
                    label: "Unordered list",
                    accelerator: "CmdOrCtrl+Shift+U",
                    click() {
                        ParagraphFunctions.addUnorderedList()
                    }
                },
                {
                  label: "Ordered list",
                  accelerator: "CmdOrCtrl+Shift+O",
                  click() {
                      ParagraphFunctions.addOrderedList()
                  }
                },
                {
                    type: "separator"
                },
                {
                    label: "Horizontal line",
                    accelerator: "CmdOrCtrl+Shift+H",
                    click() {
                        ParagraphFunctions.addHorizontalLine()
                    }
                },
                {
                    type: "separator"
                },
                {
                    label: "Code Block",
                    accelerator: "CmdOrCtrl+Shift+K",
                    click() {
                        ParagraphFunctions.addCodeBlock()
                    }
                },
                {
                    label: "Blockquote",
                    accelerator: "CmdOrCtrl+Q",
                    click() {
                        ParagraphFunctions.addQuote()
                    }
                }
            ]
        },
        {
            label: "Format",
            submenu: [
                {
                    label: "Bold",
                    accelerator: "CmdOrCtrl+B",
                    async click() {
                        let focusedContent = webContents.getFocusedWebContents()
                        await focusedContent.executeJavaScript(`
                            var editor = document.getElementById("editor")
                            document.execCommand('bold', false, null)

                            Editor.triggerInput()                            
                        `)
                    }
                },
                {
                    label: "Italic",
                    accelerator: "CmdOrCtrl+I",
                    async click() {
                        let focusedContent = webContents.getFocusedWebContents()
                        await focusedContent.executeJavaScript(`
                            var editor = document.getElementById("editor")
                            document.execCommand('italic', false, null)
                            
                            Editor.triggerInput()                            
                        `)
                    }
                },
                {
                    label: "Underline",
                    accelerator: "CmdOrCtrl+U",
                    async click() {
                        let focusedContent = webContents.getFocusedWebContents()
                        await focusedContent.executeJavaScript(`
                            var editor = document.getElementById("editor")
                            document.execCommand('underline', false, null)
                            
                            Editor.triggerInput()
                        `)
                    }
                },
                {
                    label: "Strikethrough",
                    accelerator: "CmdOrCtrl+T",
                    async click() {
                        let focusedContent = webContents.getFocusedWebContents()
                        await focusedContent.executeJavaScript(`
                        var editor = document.getElementById("editor")
                        document.execCommand("strikethrough", false, null)
                        
                        Editor.triggerInput()
                        `)
                    }
                },
                {
                    type: "separator"
                },
                {
                    label: "Toggle Letter Case",
                    accelerator: "CmdOrCtrl+L",
                    async click() {
                        var focusedContent = webContents.getFocusedWebContents()

                        await focusedContent.executeJavaScript(`
                            Format.switchCase()
                        `)
                    }
                }
            ]
        },
        {
            label: "Themes",
            submenu: Themes.getThemeNames().map((fileName) => {
                return {
                    label: fileName.replace("css", "").replace(/[-.]/g, " ").split(" ").map((word) => {
                        return word.charAt(0).toUpperCase() + word.slice(1)
                    }).join(" "), click: () => {
                        Themes.loadTheme(fileName)
                    }
                }
            })
        },
        {
            label: "View",
            submenu: [
                {
                    label: "Toggle Source Code Mode",
                    accelerator: "CmdOrCtrl+K",
                    click() {
                        ViewFunctions.toggleSourceMode()
                    }
                },
                {
                  type: "separator"
                },
                {
                    label: "Scroll To Bottom",
                    accelerator: "CmdOrCtrl+Down",
                    click() {
                        ViewFunctions.scrollToBottom()
                    }
                }
            ]
        },
        {
            label: "Help",
            submenu: [
                {
                    label: "Check For Updates",
                    async click() {
                        checkForUpdates()
                    }
                }
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

    mainWindow.on('close', async (e) => {
        let reg = /Typeflow - .*•/

        if (mainWindow.title === "Typeflow" || !reg.test(mainWindow.title)) return

        const choice = dialog.showMessageBoxSync(mainWindow, {
            type: 'question',
            buttons: ['Save and Exit', 'Exit without saving', 'Cancel'],
            defaultId: 0,
            title: 'Save your work',
            message: 'Save your changes in the file.'
        })

        if (choice === 0) {
            e.preventDefault()

            FileFunctions.saveFile()
            app.exit()
        } else if (choice === 2) {
            e.preventDefault()
        }

    })

    mainWindow.webContents.once('dom-ready', () => {
        checkForUpdates()

        try {
            checkOpenFileWith()
        }
        catch(e) {

        }
    })
})

var filePath = ""

class FileFunctions {

    /*static async exportToPDF() {
        const pdf = await mdToPdf({ path: path }).catch(console.log("error"))

        if(pdf) {
            fs.writeFileSync(pdf.fileName, pdf.content)
        }
    }*/

    static async newFile() {
        let win = BrowserWindow.getFocusedWindow()
        win.reload()
    }


    static async saveFile() {
        var focusedContent = webContents.getFocusedWebContents()

        let isSaved = await focusedContent.executeJavaScript(`Title.isDocumentSaved()`)

        if (!isSaved) {
            await this.saveFileAs(false)

            return
        }

        //let content = await focusedContent.executeJavaScript(`document.getElementById("source-code").value.replace(/(\\n\\n)/g, "  \\n")`)
        let content = await focusedContent.executeJavaScript(`document.getElementById("source-code").value`)

        fs.writeFileSync(filePath, content)

        await webContents.getFocusedWebContents().executeJavaScript(`
        document.title = document.title.replace("•", "")
        `)
    }

    static async saveFileAs() {
        const focusedContent = webContents.getFocusedWebContents()

        let content = await focusedContent.executeJavaScript(`document.getElementById("source-code").value`)
        let isSaved = await focusedContent.executeJavaScript(`Title.isDocumentSaved()`)

        if (!isSaved) {
            dialog.showSaveDialog({
                filters: [
                    {name: 'Markdown', extensions: ['md']}
                ]
            }).then(result => {
                // Write the contents of the div to the selected file
                writeFile(result.filePath, content, async (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('File saved');

                        await focusedContent.executeJavaScript(`
                    document.title = 'Typeflow - ${result.filePath.replace(/^.*[\\\/]/, '')}'
                    `);
                    }
                });
            });
        } else {
            dialog.showSaveDialog({
                filters: [
                    {name: 'Markdown', extensions: ['md']}
                ],
                defaultPath: filePath
            }).then(result => {
                writeFile(result.filePath, content, async (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('File saved');

                        await focusedContent.executeJavaScript(`
                    document.title = 'Typeflow - ${result.filePath.replace(/^.*[\\\/]/, '')}'
                    `);
                    }
                });
            })
        }
    }

    static async openFile() {
        dialog.showOpenDialog({
            filters: [
                {name: 'Markdown', extensions: ['md']}
            ]
        }).then(result => {
            // Read the contents of the selected file
            readFile(result.filePaths[0], 'utf8', async (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(result.filePaths[0])
                    filePath = result.filePaths[0]

                    const allContents = webContents.getAllWebContents()
                    const focusedContents = allContents.filter(wc => wc.isFocused())

                    await focusedContents[0].executeJavaScript(`
                        document.getElementById('source-code').value = "${data.replace(/\r\n|\r|\n/g, '\\n').replace(/"/g, '&quot;')}"
                        var editor = document.getElementById("editor")
                        editor.innerHTML = marked.parse(sourceCode.value)
                        document.title = 'Typeflow - ${result.filePaths[0].replace(/^.*[\\\/]/, '')}'
                        
                        Editor.setSelectorPosition(Editor.getLastNode())
                        
                        Editor.triggerInput()
                        `);
                }
            });
        });
    }
}

class ParagraphFunctions {
    static async addQuote() {
        await webContents.getFocusedWebContents().executeJavaScript(`
        var currentNode = Editor.getCurrentNode()
        
        var q = document.createElement("blockquote")
        
        Editor.removeBR()
        
        currentNode.appendChild(q)
        q.appendChild(document.createElement("br"))
        
        Editor.triggerInput()
        `)
    }

    static async addCodeBlock() {
        const focusedContent = webContents.getFocusedWebContents()
        await focusedContent.executeJavaScript(`
        var currentNode = document.getSelection().anchorNode
        
        var pre = document.createElement("pre")
        var code = document.createElement("code")
        code.setAttribute("class", "language-python")
        var br = document.createElement("br")
        
        Editor.removeBR()
        
        currentNode.appendChild(pre)
        pre.appendChild(code)
        code.appendChild(br)
        
        Editor.triggerInput()
        `)
    }

    static async addHorizontalLine() {
        const focusedContent = webContents.getFocusedWebContents()
        await focusedContent.executeJavaScript(`
        var currentNode = document.getSelection().anchorNode
        
        var hr = document.createElement("hr")
        var br = document.createElement("br")
        
        Editor.removeBR()
        
        currentNode.appendChild(hr)
        currentNode.appendChild(br)
        
        var range = document.createRange();
        var sel = window.getSelection();
        range.setStart(br, 0);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        
        Editor.triggerInput()
        ;0
        `)
    }

    static async addUnorderedList() {
        const focusedContent = webContents.getFocusedWebContents()
        await focusedContent.executeJavaScript(`
        var currentNode = document.getSelection().anchorNode
        if(currentNode.parentNode.parentNode.nodeName !== "BODY") {
            currentNode.remove()
        }
        
        var ul = document.createElement("ul");
        editor.appendChild(ul);
        var li = document.createElement("li")
        ul.appendChild(li)

        var range = document.createRange();
        var sel = window.getSelection();
        range.setStart(ul.firstChild, 0);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        `)


    }

    static async addOrderedList() {
        const focusedContent = webContents.getFocusedWebContents()
        await focusedContent.executeJavaScript(`
        
        document.execCommand('insertOrderedList')
        
        `)
    }

    static async addHeading(num) {
        const allContents = webContents.getAllWebContents()
        const focusedContents = allContents.filter(wc => wc.isFocused())

        await focusedContents[0].executeJavaScript(`
    var tags = "";
    
    for(let i = 0; i < "${num}"; i++) {
        tags += "#"
    }
    
    var markIt = document.getElementById('editor')
    var currentNode = document.getSelection().anchorNode
    
    var heading = document.createElement("h${num}")
    heading.innerHTML += "<br>"
    
    Editor.removeBR()
    
    currentNode.appendChild(heading)
    
    var range = document.createRange()
    var sel = window.getSelection()

    range.setStart(heading, 0)
    range.collapse(true)

    sel.removeAllRanges()
    sel.addRange(range)
    `)
    }
}

class ViewFunctions {
    static scrollToBottom() {
        const focusedContent = webContents.getFocusedWebContents()

        focusedContent.executeJavaScript(`
        window.scrollTo(0, document.body.scrollHeight)
        `)
    }

    static toggleSourceMode() {
        const focusedContent = webContents.getFocusedWebContents()

        focusedContent.executeJavaScript(`
        var sourceCode = document.getElementById("source-code")
        var editor = document.getElementById("editor-container")
        
        if(sourceCode.style.display === "none") {
            sourceCode.style.display = "block"
            editor.style.display = "none"
        }
        else {
            sourceCode.style.display = "none"
            editor.style.display = "block"
        }
        `)
    }
}

async function checkForUpdates() {
    var focusedContent = webContents.getFocusedWebContents()

    const pjsonPath = app.getAppPath() + "/package.json"
    let json = JSON.parse(fs.readFileSync(pjsonPath, 'utf-8'))
    const installedVersion = "v" + json.version + "b"

    const latestVersion = await focusedContent.executeJavaScript(`
                        Updates.getLatestRelease()
                        `)

    if(latestVersion === "") {
        checkForUpdates()

        return
    }

    console.log("Installed version: " + installedVersion)
    console.log("Latest version: " + latestVersion)

    if (latestVersion !== installedVersion && latestVersion !== "") {
        const choice = dialog.showMessageBoxSync(mainWindow, {
            type: 'none',
            buttons: ['Install', 'Cancel'],
            defaultId: 0,
            title: `New Typeflow version ${latestVersion} is available!`,
            message: 'Install the new version for new content and improved functionality.'
        })

        if (choice === 0) {
            await shell.openExternal("https://github.com/L33dy/typeflow/releases")
        }
    }
}

async function checkOpenFileWith() {
    var focusedContent = webContents.getFocusedWebContents()

    if(process.argv.length >= 2) {
        filePath = process.argv[1]

        let fileContent = fs.readFileSync(filePath, 'utf-8')

        await focusedContent.executeJavaScript(`
        
        document.getElementById('source-code').value = "${fileContent.replace(/\r\n|\r|\n/g, '\\n').replace(/"/g, '&quot;')}"
        var editor = document.getElementById("editor")
        editor.innerHTML = marked.parse(sourceCode.value)
        document.title = 'Typeflow - ${filePath.replace(/^.*[\\\/]/, '')}'
                        
        Editor.setSelectorPosition(Editor.getLastNode())
        
        Editor.triggerInput()
        `)
    }
}