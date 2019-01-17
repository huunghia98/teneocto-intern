
<template>
    <div class="container">
        <div class="w-75 row container mb-5">
            <h2 class="w-50">Product Upload</h2>
            <form class="w-50" id="formUpload" name="Product Upload" @submit.prevent="addItem">
                <div class="form-group">
                <label for="productName">Product name</label>
                <input class="form-control" v-model="productName" type="text" id="productName" required>
                </div>
                <div class="form-group">
                <label for="quantity">Quantity</label>
                <input class="form-control" v-model="quantity" type="number" id="quantity" min="0" required>
                </div>
                <div class="form-group">
                <label for="price">Price</label>
                <input class="form-control" v-model="price" type="number" id="price" min="0" required>
                </div>
                <div class="form-group">
                <label for="description">Description</label>
                <textarea class="form-control" v-model="description" id="description" ></textarea>
                </div>
                <div class="form-group">
                <label for="category">Category  </label>
                <select class="custom-select" v-model="category"  id="category" required>
                    <option value="clothes"> Clothes</option>
                    <option value="plans"> Plans</option>
                    <option value="animal"> Animal</option>
                    <option value="food"> Food</option>
                    <option value="book"> Book</option>
                </select>
                </div>
                <div class="form-group">
                <label for="imageInput">Product Image  </label>
                <input class="form-control-sm" type="file" id="imageInput" name="image" accept="image/jpg" @change="addImage" required>
                </div>
                <button class="btn btn-primary" type="submit">Add item</button>
                <button class="btn btn-secondary ml-3" @click="resetForm">Reset</button>
            </form>
        </div>
        <div class="container">
            <table class="table table-borderless">
                <tr class="">
                    <th scope="col"> Number</th>
                    <th scope="col"> Product Name</th>
                    <th scope="col"> Quantity</th>
                    <th scope="col"> Price</th>
                    <th scope="col"> Description</th>
                    <th scope="col">Category</th>
                    <th scope="col"> Image</th>
                </tr>
                <tr v-for="(item,index) in listItem" v-if="!(isEditting == index)" :key="item.index">
                    <td>{{index+1}}</td>
                    <td>{{item.productName}}</td>
                    <td>{{item.quantity}}</td>
                    <td>{{item.price}}</td>
                    <td>{{item.description}}</td>
                    <td>{{item.category}}</td>
                    <td><img v-bind:src="item.imageUrl" style="max-width:150px;max-height: 100px;"></td>
                    <td>
                    <button class="btn btn-outline-dark mr-2" @click="edit(index)">Edit</button>
                    <button class="btn btn-danger" @click="deleteProduct(item.id)">Delete</button>
                    </td>
                </tr>
                <tr v-else>
                    <td>{{index}}</td>
                    <td><input class="form-control" type="text" v-model="editting.productName" required></td>
                    <td><input class="form-control" v-model="editting.quantity" type="number" min="0" required></td>
                    <td><input class="form-control" v-model="editting.price" type="number" min="1" required></td>
                    <td><textarea class="form-control" v-model="editting.description"></textarea></td>
                    <td><select class="custom-select form-control" v-model="editting.category" required>
                        <option value="clothes"> Clothes</option>
                        <option value="plans"> Plans</option>
                        <option value="animal"> Animal</option>
                        <option value="food"> Food</option>
                        <option value="book"> Book</option>
                    </select>
                    </td>
                    <td>
                        <input  class="form-control-sm" type="file" accept="image/jpg" @change="editImage" required>
                    </td>
                    <td>
                        <button class="btn btn-success mr-2" @click="saveEditting()">Save</button>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
    import firebase from 'firebase'
    import 'firebase/storage'

    var config = {
        apiKey: "AIzaSyCvFXEhoTxhJ4MBScDatMg9W9ckcGSi63U",
        authDomain: "form-uploader-demo.firebaseapp.com",
        databaseURL: "https://form-uploader-demo.firebaseio.com",
        projectId: "form-uploader-demo",
        storageBucket: "form-uploader-demo.appspot.com",
        messagingSenderId: "590709385854"
    };
    var app = firebase.initializeApp(config);

    var firestore = app.firestore();
    firestore.settings({
        timestampsInSnapshots: true
    });

    var storageRef = app.storage().ref();

    var docRef = firestore.collection("products");

    class Control {
        async writeOne(data) {
            await docRef.add(data)
        }

        async getData() {
            let a = [];
            let x = await docRef.get();
            x.forEach(doc => {
                let tmp = doc.data();
                tmp['id'] = doc.id;
                a.push(tmp);
            });
            return a;
        }

        async deleteId(id) {
            await docRef.doc(id).delete();
        }

        async updateId(id, data) {
            await this.deleteId(id);
            this.writeOne(data);
        }
        async upload(image){
            if(!image) return '';
            let img = await storageRef.child(image.name).put(image);
            return img.ref.getDownloadURL();
        }
    }

    var control = new Control();

    export default {
        name: 'FormUpload',
        data: function() {
            return {
                productName: '',
                quantity: '',
                price: '',
                description: '',
                category: '',
                image: File,
                listItem: [],
                isEditting: -1,
                indexEditing:'',
                editting:{
                    productName:'',
                    quantity: '',
                    price: '',
                    description: '',
                    category: '',
                    image: File,
                }
            }
        },
        created() {
            this.getItem();
        },

        methods: {
            resetForm:function(){
                this.productName="";
                this.quantity='';
                this.price='';
                this.description='';
                this.category='';
                this.image='';
            },
            addImage: function () {
                var x = document.getElementById("imageInput");
                this.image = x.files[0];
            },
            addItem: async function () {
                let url=await control.upload(this.image);
                let data = this;
                let data2 = {
                    productName: data.productName,
                    quantity: data.quantity,
                    price: data.price,
                    description: data.description,
                    category: data.category,
                    imageUrl: url
                }
                this.resetForm();
                await control.writeOne(data2);
                await this.getItem();
                console.log(this.$data);
            },
            getItem: async function(){
                this.listItem= await control.getData();
            },

            // table
            edit: function(ind){
                this.editting.image = "";
                this.isEditting = ind;
                this.editting =this.listItem[ind];
            },
            deleteProduct: async function (id) {
                await control.deleteId(id);
                this.getItem();
            },
            editImage: function (event) {
                this.editting.image = event.target.files[0]
            },
            saveEditting: async function () {
                let tmp = this.listItem[this.isEditting].id;
                this.isEditting = -1;
                if (!this.editting.image){
                    this.getItem();
                    return;
                }
                let url = await control.upload(this.editting.image);
                let x = new Object(this.editting);
                delete x.image;
                x.imageUrl = url;
                await control.updateId(tmp,x);
                this.getItem();
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
