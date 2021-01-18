// day:
// The representation of the day.
// Possible values are "numeric", "2-digit".
// weekday:
// The representation of the weekday.
// Possible values are "narrow", "short", "long".
// year:
// The representation of the year.
// Possible values are "numeric", "2-digit".
// month:
// The representation of the month.
// Possible values are "numeric", "2-digit", "narrow", "short", "long".
// hour:
// The representation of the hour.
// Possible values are "numeric", "2-digit".
// minute: The representation of the minute.
// Possible values are "numeric", "2-digit".
// second:
// The representation of the second.
// Possible values are "numeric", 2-digit"

export function getNormalDisplayDate(date){
    var options = { weekday:'short', day: 'numeric', year: 'numeric', month: 'long' };
    if(date){
        console.log();
    }
    else{
        let x = new Date();
        return x.toLocaleDateString("en-US", options);
    }
}

export function getAPIFormat(date){
    let today;
    if(date){
        today = new Date(date);
    }
    else{
        today = new Date();
    }
    today = today.toLocaleDateString("en-US");
    today = today.split("/");
    let temp = today[2];
    today.splice(2,1);
    today.unshift(temp);
    return today.join("-");
}


export function setExitNodeInfo(tree, memberData){
    if(tree == null){
        return;
    }
    
    if(tree.way_point_node){
        tree.name = memberData.short_name;
        tree.exit_link =  memberData.subtree_id;
        return;
    }
    else{
        if(tree.children){
            for(let child of tree.children){
                setExitNodeInfo(child, memberData);
            }
        }
    }
}