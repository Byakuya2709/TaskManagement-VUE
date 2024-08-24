<!-- Alert.vue -->
<template>
    <div v-if="show" :class="typeAlert" role="alert">
      <strong class="font-bold">{{ type }}</strong>
      <hr>
      <span class="block sm:inline">{{ message }}.</span>
      <span @click="hideAlert" class="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer ">
          <i class="fa-solid fa-x"></i>
          <title>Close</title>
      </span>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      show: {
        type: Boolean,
        default: false,
      },
      type: {
        type: String,
        default: 'info',
      },
      message: {
        type: String,
        default: '',
      },
    },
    computed:{
        typeAlert(){
        return {
        'bg-red-100 border border-red-400 text-red-700 my-4 mx-4 px-4 py-3 rounded relative': this.type === 'Error',
        'bg-blue-100 border border-blue-400 text-blue-700 my-4 mx-4 px-4 py-3 rounded relative ': this.type === 'Info',
        'bg-green-100 border border-green-400 text-green-700 my-4 mx-4 px-4 py-3 rounded relative ': this.type === 'Success',
        // Add more classes based on your alert types
      };
        }

    },
    methods: {
      hideAlert() {
        this.$emit('close-alert');
      },
    },
  };
  </script>
  
  <style scoped>
  </style>
  