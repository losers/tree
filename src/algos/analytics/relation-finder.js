var ProData = require("../../data").default;

let arr = [];
function treeUpDown(data, id) {
    if (data == null) {
        return false;
    }

    if (data.id == id) {
        let x = {};
        x.name = data.name;
        x.id = data.id;
        arr.push(x);
        return true;
    }
    else if (data.mate) {
        for (let mate of data.mate) {
            if (mate.id == id) {
                let x = {};
                x.name = data.name;
                x.id = data.id;
                x.mate = [];
                x.mate.push(mate);
                arr.push(x);
                return true;
            }
        }
    }

    if (data.children) {
        for (let i = 0; i < data.children.length; i++) {
            let y = treeUpDown(data.children[i], id);
            if (y) {
                let z = {};
                let mem = data;
                z.name = mem.name;
                z.id = mem.id;
                arr.push(z);
                return true;
            }
        }
    }
}

var getRelationTree = function (tree, p1, p2) {
    arr = [];
    treeUpDown(tree, p1);
    let newArr = [];
    newArr = arr;
    arr = [];
    treeUpDown(tree, p2);
    let newArr2 = [];
    newArr2 = arr;

    let l1 = newArr.length - 1;
    let l2 = newArr2.length - 1;

    while (newArr.length > 1 && newArr2.length > 1) {
        if (newArr[l1 - 1].id == newArr2[l2 - 1].id) {
            newArr.pop();
            newArr2.pop();
            l1--;
            l2--;
        }
        else {
            break;
        }
    }

    let newTree = {};

    if (newArr.length == 1 && newArr2.length == 1) {
        if (newArr[0].mate && newArr2[0].mate) {
            newArr[0].mate.push(newArr2[0].mate[0]);
            newTree = newArr[0];
        }
        else {
            newTree = (newArr[0].mate) ? newArr[0] : newArr2[0];
        }
    }
    else {
        newTree = newArr.pop();
        let temp = newTree;
        while (newArr.length >= 1) {
            temp.children = [];
            temp.children.push(newArr.pop());
            temp = temp.children[0];
        }

        temp = newTree;
        let temp2 = newArr2.pop();
        if (temp2.mate) {
            temp.mate = temp2.mate;
        }
        while (newArr2.length >= 1) {
            if (!temp.children) {
                temp.children = [];
            }
            temp.children.push(newArr2.pop());
            temp = temp.children[temp.children.length - 1];
        }
    }
    return newTree;
}

var getAllGuys = function (tree, allMembers) {
    if (tree == null) {
        return;
    }
    let member = {};
    member.label = tree.name;
    member.value = tree.id;
    allMembers.push(member);
    if (tree.mate) {
        for (let mate of tree.mate) {
            member = {};
            member.value = mate.id;
            member.label = mate.name;
            allMembers.push(member);
        }
    }

    if (tree.children) {
        for (let i = 0; i < tree.children.length; i++) {
            getAllGuys(tree.children[i], allMembers);
        }
    }
    return allMembers;
}

function getSubTree(tree, id) {
    if (tree == null) {
        return;
    }

    if (tree.id == id) {
        return tree;
    }

    if(tree.mate){
        for(let mate of tree.mate){
            if(mate.id == id){
                return tree;
            }
        }
    }
    if (tree.children) {
        for (let i = 0; i < tree.children.length; i++) {
            let x = getSubTree(tree.children[i], id);
            if (x) {
                return x;
            }
        }
    }
}

function getAllIds(tree, arr) {
    if (tree == null) {
        return tree;
    }
    arr.push(tree.id);
    if (tree.mate) {
        for(let mate of tree.mate){
            arr.push(mate.id);
        }
    }
    if (tree.children) {
        for (let child of tree.children) {
            getAllIds(child, arr);
        }
    }
}

function attachGender(tree, genderMap) {
    if (tree == null) {
        return;
    }
    tree.gender = genderMap[tree.id];
    if (tree.mate) {
        for (let index in tree.mate) {
            tree.mate[index].gender = genderMap[tree.mate[index].id];
        }
    }
    if (tree.children) {
        for (let i = 0; i < tree.children.length; i++) {
            attachGender(tree.children[i], genderMap);
        }
    }
}

function findLevel(tree, id, level) {
    if (tree == null) {
        return;
    }
    if (tree.id == id) {
        return { "level": level, "gender": tree.gender };
    }

    if (tree.mate) {
        for (let mate of tree.mate) {
            if (mate.id == id) {
                return { "level": level, "gender": mate.gender, "is_mate": true };
            }
        }
    }

    if (tree.children) {
        for (let child of tree.children) {
            let x = findLevel(child, id, level + 1);
            if (x) {
                return x;
            }
        }
    }
}

function checkForInvRelation(tree, toChange, isInv, considerLastGirl) {
    if (tree == null) {
        return isInv;
    }
    if (toChange) {
        toChange = false;
        isInv = !isInv;
    }
    if (tree.gender == 0) {
        toChange = true;
    }
    if (tree.children)
        return checkForInvRelation(tree.children[0], toChange, isInv, considerLastGirl);
    else {
        if (toChange && considerLastGirl) {
            isInv = !isInv
        }
        return isInv;
    }
}

function findRelationName(subTree, genders, p1Id, p2Id, relationType = "western") {
    let relations = ProData.relations[relationType];

    let genderMap = {};
    for (let i = 0; i < genders.length; i++) {
        let x = genders[i];
        if (x.gender)
            genderMap[x._id] = x.gender;
    }
    attachGender(subTree, genderMap);
    let p1 = findLevel(subTree, p1Id, 0);
    let p2 = findLevel(subTree, p2Id, 0);

    let isSameLane = false;
    let strict = false;
    isSameLane = (subTree.id == p1Id) || (subTree.id == p2Id) || ((subTree.mate) && subTree.mate[0].id == p1Id) || ((subTree.mate) && subTree.mate[0].id == p2Id);

    let sameLane = isSameLane ? "same" : "other";
    if (p1.level == 1 && p2.level == 1) {
        sameLane = "same";
    }

    let relationLev = p1.level - p2.level;
    if (relationLev < -3) relationLev = -3;
    if (relationLev > 3) relationLev = 3;

    if (relationLev == 0) {
        if (p1.is_mate || p2.is_mate) {
            sameLane = "inv";
            strict = true;
        }
        if (p1.level == 0 && p2.level == 0) {
            sameLane = (p1.gender == p2.gender) ? "sav" : "spl";
        }
    }
    else if ((p2.is_mate && relationLev < 0) || (p1.is_mate && relationLev > 0)) {
        sameLane = "inv";
    }

    if (relationType != "western" && sameLane != "spl" && sameLane != "sav" && subTree.children && subTree.children.length > 1) {
        var considerLastGirl1 = false;
        var considerLastGirl2 = false;
        if (((p1.gender == 0) || (p1.gender == 1 && p1.is_mate)) && relationLev < 0) {
            considerLastGirl1 = true;
        }
        if (((p2.gender == 0) || (p2.gender == 1 && p2.is_mate)) && relationLev > 0) {
            considerLastGirl2 = true;
        }
        let isInv1 = checkForInvRelation(subTree.children[0], false, false, considerLastGirl1);
        let isInv2 = checkForInvRelation(subTree.children[1], false, false, considerLastGirl2);

        // if (p1.gender == 0 && p1.level < p2.level && !p1.is_mate && !p2.is_mate) { //Vani to Sai, Usha to Sai, Giri to Usha
        //     isInv1 = !isInv1;
        // }
        // else if (p2.gender == 0 && p2.level < p1.level && !p2.is_mate) {
        //     isInv2 = !isInv2;
        // }
        // else if (p2.gender == 1 && p2.level < p1.level && p2.is_mate) {
        //     isInv2 = !isInv2;
        // }

        if (isInv1 != isInv2) {
            if (sameLane == "inv" && !strict) {
                sameLane = "other";
            }
            else {
                sameLane = "inv";
            }
        }
    }
    return relations[relationLev][sameLane][p2.gender];
}

module.exports.getAllGuys = getAllGuys;
module.exports.getRelationTree = getRelationTree;
module.exports.getSubTree = getSubTree;
module.exports.getAllIds = getAllIds;
module.exports.findRelationName = findRelationName;