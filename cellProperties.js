let sheetDB=[];

for(let i=0;i<rows;i++){
let sheetRow=[];
for(let j=0;j<cols;j++){
let cellProp = {
  bold:false,
  italic:false,
  undeline:false,
  alignment:"left",
  fontfamily:"monospace",
  fontSize:"14",
  fontcolor:"#000000",
  BGcolor:"#000000",
  value:"",
  formula:"",
  children:[],
}
sheetRow.push(cellProp);
}
sheetDB.push(sheetRow)
}
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let alignment = document.querySelectorAll(".alignment");
let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rigthAlign = alignment[2];

let fontColor = document.querySelector(".font-color-prop");
let fontfamily= document.querySelector(".font-family-prop");
let fontSize = document.querySelector(".font-size-prop");
let BGcolor = document.querySelector(".BG-color-prop");


let activecolorProp ="#A9A9A9";
let inactivecolorProp="	#FFFFFF";


bold.addEventListener("click",(e)=>{
    let address=addressBar.value;
    let [cell,cellProp]=activecell(address);

    cellProp.bold=!cellProp.bold;
    cell.style.fontWeight = cellProp.bold?"bold":"normal";
    bold.style.backgroundColor = cellProp.bold?activecolorProp:inactivecolorProp;

})
italic.addEventListener("click",(e)=>{
    let address=addressBar.value;
    let [cell,cellProp]=activecell(address);

    cellProp.italic=!cellProp.italic;
    cell.style.fontStyle = cellProp.italic?"italic":"normal";
    italic.style.backgroundColor = cellProp.italic?activecolorProp:inactivecolorProp;

})
underline.addEventListener("click",(e)=>{
    let address=addressBar.value;
    let [cell,cellProp]=activecell(address);

    cellProp.underline=!cellProp.underline;
    cell.style.textDecoration = cellProp.underline?"underline":"none";
    underline.style.backgroundColor = cellProp.underline?activecolorProp:inactivecolorProp;

})
fontSize.addEventListener("change",(e)=>{
    let address = addressBar.value;
    let [cell,cellProp]=activecell(address);
    cellProp.fontSize=fontSize.value;
    cell.style.fontSize=cellProp.fontSize+"px";
    fontSize.value = cellProp.fontSize;

})
fontfamily.addEventListener("change",(e)=>{
    let address = addressBar.value;
    let [cell,cellProp]=activecell(address);
    cellProp.fontfamily=fontfamily.value;
    cell.style.fontFamily=cellProp.fontfamily;
    fontfamily.value = cellProp.fontfamily;

})
fontColor.addEventListener("change",(e)=>{
    let address = addressBar.value;
    let [cell,cellProp]=activecell(address);
    cellProp.fontColor=fontColor.value;
    cell.style.color=cellProp.fontColor;
    fontColor.value = cellProp.fontColor;

})

BGcolor.addEventListener("change",(e)=>{
    let address = addressBar.value;
    let [cell,cellProp]=activecell(address);
    cellProp.BGcolor=BGcolor.value;
    cell.style.backgroundColor=cellProp.BGcolor;
    BGcolor.value = cellProp.BGColor;

})


alignment.forEach((alignElem) => {
    alignElem.addEventListener("click",(e)=>{
        let address = addressBar.value;
        let [cell,cellProp]=activecell(address);
        let alignValue = e.target.classList[0];
        cellProp.alignment=alignValue;
        cell.style.textAlign=cellProp.alignment;
        switch(alignValue){
            case "left":
                leftAlign.style.backgroundColor=activecolorProp;
                centerAlign.style.backgroundColor=inactivecolorProp;
                rigthAlign.style.backgroundColor=inactivecolorProp;
                break;
            case "center":
                    leftAlign.style.backgroundColor=inactivecolorProp;
                    centerAlign.style.backgroundColor=activecolorProp;
                    rigthAlign.style.backgroundColor=inactivecolorProp;
                    break;
            case "right":
                        leftAlign.style.backgroundColor=inactivecolorProp;
                        centerAlign.style.backgroundColor=inactivecolorProp;
                        rigthAlign.style.backgroundColor=activecolorProp;
                        break;
        }

    })
})
let allCells = document.querySelectorAll(".cell");
for(let i =0;i<allCells.length;i++){
    addEventListenerListenerToAttachCellProperties(allCells[i]);

}

function addEventListenerListenerToAttachCellProperties(cell){
    cell.addEventListener("click",(e)=>{
        let address = addressBar.value;
        let [rid,cid]=decodeRIDCIDfromAddress(address);
        let cellProp = sheetDB[rid][cid];
        cell.style.fontWeight = cellProp.bold?"bold":"normal";
        cell.style.fontStyle = cellProp.italic?"italic":"normal";
        cell.style.textDecoration = cellProp.underline?"underline":"none";
        cell.style.color=cellProp.fontColor;
        cell.style.backgroundColor=cellProp.BGcolor==="#000000"?"trasparent":cellProp.BGColor;
        cell.style.fontFamily=cellProp.fontfamily;
        cell.style.fontSize=cellProp.fontSize+"px";
        cell.style.textAlign=cellProp.alignment;

        bold.style.backgroundColor=cellProp.bold?activecolorProp:inactivecolorProp;
        italic.style.backgroundColor=cellProp.italic?activecolorProp:inactivecolorProp;
        underline.style.backgroundColor=cellProp.underline?activecolorProp:inactivecolorProp;
        fontColor.value=cellProp.fontColor;
        BGcolor.value=cellProp.BGColor;
        fontSize.value=cellProp.fontSize;
        fontfamily.value=cellProp.fontFamily;
        switch(cellProp.alignment){
            case "left":
                leftAlign.style.backgroundColor=activecolorProp;
                centerAlign.style.backgroundColor=inactivecolorProp;
                rigthAlign.style.backgroundColor=inactivecolorProp;
                break;
            case "center":
                    leftAlign.style.backgroundColor=inactivecolorProp;
                    centerAlign.style.backgroundColor=activecolorProp;
                    rigthAlign.style.backgroundColor=inactivecolorProp;
                    break;
            case "right":
                        leftAlign.style.backgroundColor=inactivecolorProp;
                        centerAlign.style.backgroundColor=inactivecolorProp;
                        rigthAlign.style.backgroundColor=activecolorProp;
                        break;
        }
       let formulaBar = document.querySelector(".formula-bar");
       formulaBar.value = cellProp.formula;
       cell.value = cellProp.value; 

    })
}









function activecell(address){
    let [rid,cid]=decodeRIDCIDfromAddress(address);
     let cell = document.querySelector(`.cell[rid="${rid}"][cid ="${cid}"]`);
     let cellProp=sheetDB[rid][cid];
     return [cell,cellProp];
}
function decodeRIDCIDfromAddress(address){
    let rid = Number(address.slice(1))-1;
    let cid=Number(address.charCodeAt(0))-65;
    return [rid,cid];
}