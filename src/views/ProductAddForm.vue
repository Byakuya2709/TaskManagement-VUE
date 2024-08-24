<template>
  <main>
    <div id="product-form">
      <h1 class="form-title">Product Form</h1>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <form @submit.prevent="submitForm" enctype="multipart/form-data">
       <div class="container">
        <div class="row">
          <div class="col-8">
            <div class="custom-file">
              <label class="custom-file-label" for="imageUpload">Upload Image:</label>
              <input class="custom-file-input" type="file" id="imageUpload" @change="previewImage" accept="image/png, image/jpeg">
              <img  :src="imagePreview" alt="Image Preview" v-if="imagePreview" style="max-height: 300px; margin-top: 10px;">
            </div>
          </div>
          <div class="col-4" id="form-customer">
            <div class="input-group">
              <input type="text" id="productName" v-model="product.productName" required>
              <label for="productName">Product Name:</label>
          </div>
          <div class="input-group">
          <input type="number" id="productPrice" v-model="product.productPrice" min="0" required>
          <label for="productPrice">Product Price:</label>
        </div>
        <div class="input-group">
          <select id="productType" v-model="product.productType" required>
            <option v-for="type in productTypes" :key="type.type_id" :value="type.type_id">{{ type.type_name }}</option>
        </select>
        <label for="productType">Product Type:</label>
      </div>
      <div class="input-group">
        <textarea id="productDescription" v-model="product.productDescription" required></textarea>
        <label for="productDescription">Product Description:</label>
        </div>
        <label style="color: gray;font-size: 1rem; margin-top:5px ">Số lượng sản phẩm:</label>
        <div class="input-group">
          <div class="row row-cols-4">
            <div class="col" v-for="(size, index) in productSizes" :key="index">
            <label class="label-size">{{ size.sizeName }}:</label>
            <input  class="sizeInput" type="number" v-model="size.quantity" min="0" required>
          </div>
            </div>
          
        </div>
        <div class="row input-group"></div>
          <button type="submit" :disabled="isSubmitting">Submit</button>
            </div>
          
        </div>
        
        
        
       </div>
        
      </form>
      
    </div>
  </main>
   
  </template>
  
  <script>
  import { api } from '../api/Api'; // Sử dụng named import

export default {
  data() {
    return {
      product: {
        productName: '',
        productPrice: 0,
        productType: '',
        productDescription: ''
      },
      productTypes: [],
      productSizes: [
        { sizeName: 'S', quantity: 0 },
        { sizeName: 'M', quantity: 0 },
        { sizeName: 'L', quantity: 0 },
        { sizeName: 'XL', quantity: 0 }
      ],
      imagePreview: null,
      successMessage: '',
      errorMessage: '',
      message:'',
      isSubmitting: false
    }
  },
  methods: {
    previewImage(event) {
      const file = event.target.files[0];
      if (file) {
        this.imagePreview = URL.createObjectURL(file);
      }
    },
    async submitForm() {
      this.isSubmitting = true;
            const formData = new FormData();
      formData.append('productName', this.product.productName);
      formData.append('productPrice', this.product.productPrice);
      formData.append('productType', this.product.productType);
      formData.append('productDescription', this.product.productDescription);

      this.productSizes.forEach((size, index) => {
          formData.append('productSizes', size.sizeName);
          formData.append('quantities', size.quantity);
      });

      const imageInput = document.getElementById('imageUpload');
      if (imageInput.files[0]) {
          formData.append('image', imageInput.files[0]);
      }

      try {
        const response = await api.post('/product/new', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        const data = response.data;
        console.log(data)
        if (data.status === 'OK') {
          this.successMessage = data.message;
          this.errorMessage = '';
        } else {
          this.successMessage = '';
          this.errorMessage = data.message;
        }
      } catch (error) {
        this.successMessage = '';
        this.errorMessage = 'An error occurred while submitting the form.';
        console.log(error)
      } finally {
        this.isSubmitting = false;
      }
    },
    async fetchProductTypes() {
      try {
        const response = await api.get('/product/types');
        console.log(response.data.data);
        this.productTypes = response.data.data;
      } catch (error) {
        console.error('Error fetching product types:', error);
      }
    }
  },
  created() {
    this.fetchProductTypes();
  },
}
  </script>
  
  <style scoped>
  .success-message {
    color: green;
  }
  .error-message {
    color: red;
  }
  .label-size{
    position: relative!important;
    top: 0%!important;
  }
  </style>
  