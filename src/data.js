let data = {
    name: "Chinna Mahanadiah (Late)",
    mate: {
        name: "Padmavathamma (Late)",
        image_url: "https://static.refined-x.com/static/avatar.jpg"
    },
    image_url: "https://static.refined-x.com/static/avatar.jpg",
    children: [
        {
            name: "Pedda Guru Natham Shetty",
            image_url: "https://static.refined-x.com/static/avatar.jpg",
            mate: {
                name: "Lakshmi Devamma",
                image_url: "https://static.refined-x.com/static/avatar.jpg"
            },
            children: [
                {
                    name: "Guru Prasad",
                    image_url: "https://static.refined-x.com/static/avatar.jpg",
                    mate: {
                        name: "Geetha",
                        image_url: "https://static.refined-x.com/static/avatar.jpg"
                    },
                    children: [
                        {
                            name: "Swetha Akka",
                            image_url: "https://static.refined-x.com/static/avatar.jpg",
                            mate: {
                                name: "Giridhar",
                                image_url:
                                    "https://static.refined-x.com/static/avatar.jpg"
                            },
                            children: [
                                {
                                    name: "Lishanth",
                                    image_url:
                                        "https://static.refined-x.com/static/avatar.jpg"
                                },
                                {
                                    name: "Hemanya",
                                    image_url:
                                        "https://static.refined-x.com/static/avatar.jpg"
                                }
                            ]
                        },
                        {
                            name: "Guru Sri Kanth",
                            image_url: "https://static.refined-x.com/static/avatar.jpg"
                        }
                    ]
                },
                {
                    name: "Vidya Shankar",
                    image_url: "https://static.refined-x.com/static/avatar.jpg",
                    mate: {
                        name: "Vijaya Lakshmi",
                        image_url: "https://static.refined-x.com/static/avatar.jpg"
                    }
                },
                {
                    name: "Satyanarayana",
                    image_url: "https://static.refined-x.com/static/avatar.jpg",
                    mate: {
                        name: "Padmavathi",
                        image_url: "https://static.refined-x.com/static/avatar.jpg"
                    },
                    children: [
                        {
                            name: "Guru Sai Jaya Prakash",
                            image_url: "https://static.refined-x.com/static/avatar.jpg"
                        },
                        {
                            name: "Arun Kumar",
                            image_url: "https://static.refined-x.com/static/avatar.jpg"
                        },
                        {
                            name: "Varun Kumar",
                            image_url: "https://static.refined-x.com/static/avatar.jpg"
                        }
                    ]
                },
                {
                    name: "Sridhar",
                    image_url: "https://static.refined-x.com/static/avatar.jpg",
                    mate: {
                        name: "Vani",
                        image_url: "https://static.refined-x.com/static/avatar.jpg"
                    },
                    children: [
                        {
                            name: "Guru Teja",
                            image_url: "https://static.refined-x.com/static/avatar.jpg"
                        },
                        {
                            name: "Bhuvaneswari",
                            image_url: "https://static.refined-x.com/static/avatar.jpg"
                        }
                    ]
                }
            ]
        },
        {
            name: "children2",
            image_url: "https://static.refined-x.com/static/avatar.jpg",
            mate: {
                name: "mate",
                image_url: "https://static.refined-x.com/static/avatar.jpg"
            },
            children: [
                {
                    name: "grandchild",
                    image_url: "https://static.refined-x.com/static/avatar.jpg"
                },
                {
                    name: "grandchild2",
                    image_url: "https://static.refined-x.com/static/avatar.jpg"
                },
                {
                    name: "grandchild3",
                    image_url: "https://static.refined-x.com/static/avatar.jpg",
                    children: [
                        {
                            name: "grandchild",
                            image_url: "https://static.refined-x.com/static/avatar.jpg"
                        },
                        {
                            name: "grandchild",
                            image_url: "https://static.refined-x.com/static/avatar.jpg"
                        },
                        {
                            name: "grandchild",
                            image_url: "https://static.refined-x.com/static/avatar.jpg"
                        }
                    ]
                }
            ]
        }
    ]
};

// var x = function (data, name) {
//     if (!data) {
//         return;
//     }
//     if(data.name == name){
//         return data;
//     }
//     // console.log(data.name);
//     if (data.children) {
//         for (let i = 0; i < data.children.length; i++) {
//             let z =  x(data.children[i],name);
//             if(z){
//                 return z;
//             }
//         }
//     }
// }

// let y = x(data, "Satyanarayana");
// console.log(y);

export default data;