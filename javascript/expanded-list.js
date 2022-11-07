function expandList(id){
    let element = document.getElementById(id);
    
    element.style.maxHeight = element.scrollHeight + 20 + "px";
    element.style.paddingLeft = "10px";
    element.style.paddingRight = "10px";
    element.style.paddingBottom = "10px";
    element.style.marginBottom = "10px";
    element.style.opacity = "100%";
    element.style.borderRadius = "20px";
}

function collapseList(id){
    let element = document.getElementById(id);
    
    element.style.maxHeight = null;
    element.style.paddingLeft = "0";
    element.style.paddingRight = "0";
    element.style.paddingBottom = "0";
    element.style.marginBottom = "0";
    element.style.opacity = "0%";
    element.style.borderRadius = "0px";
}

function collapseAll(){
    let elements = document.getElementsByClassName("collapsible-list");
    
    Array.prototype.forEach.call(elements, function(element) {
        collapseList(element.id);
    });
}

function toggleList(id){
    let element = document.getElementById(id);

    if (element.style.maxHeight){
        collapseList(id);
    } else {
        collapseAll();
        expandList(id);
    } 
}

// Note: Move this to another js-file

function scrollTo(id){
    let element = document.getElementById(id);
    element.scrollIntoView({behavior: 'smooth'});
}