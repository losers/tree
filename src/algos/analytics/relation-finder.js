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
    else if ((data.mate) && (data.mate.id == id)) {
        let x = {};
        x.name = data.name;
        x.id = data.id;
        if (data.mate) {
            x.mate = data.mate;
        }
        arr.push(x);
        return true;
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
        newTree = (newArr[0].mate) ? newArr[0] : newArr2[0];
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
        newArr2.pop();
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
        member = {};
        member.value = tree.mate.id;
        member.label = tree.mate.name;
        allMembers.push(member);
    }

    if (tree.children) {
        for (let i = 0; i < tree.children.length; i++) {
            getAllGuys(tree.children[i], allMembers);
        }
    }
    return allMembers;
}


module.exports.getAllGuys = getAllGuys;
module.exports.getRelationTree = getRelationTree;