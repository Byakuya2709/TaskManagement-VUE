<template>
    <header id="header">
       <nav class="navbar navbar-expand-lg bg-body-tertiary" style="background-color:var(--header-be)!important;">
          <div class="container-fluid">
             <router-link class="logo-brand" to="/">
                <span><p>THE UNDER</p></span>
             </router-link>
             <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#main-nav" aria-controls="offcanvasNavbar2" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
             </button>
             <div class="offcanvas offcanvas-end offcanvas-size-sm" id="main-nav" tabindex="-1" aria-labelledby="offcanvasNavbar2">
                <div class="offcanvas-header">
                   <h5 class="offcanvas-title logo-brand" id="offcanvasNavbarLabel">THE UNDER</h5>
                   <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">
                   <ul class="navbar-nav ms-4">
                      <li class="menu-item">
                         <div class="dropdown">
                            <router-link class="menu-link link-active" to="/shop">SHOP</router-link>
                            <ul class="dropdown-menu">
                               <li><router-link class="dropdown-item" to="/shop#list-item-top">TOPS</router-link></li>
                               <li><router-link class="dropdown-item" to="/shop#list-item-bottom">BOTTOMS</router-link></li>
                               <li><router-link class="dropdown-item" to="/shop#list-item-asso">ACCESSORIES</router-link></li>
                            </ul>
                         </div>
                      </li>
                      <li class="menu-item">
                         <div class="dropdown">
                            <router-link class="menu-link link-active" to="/bray">BRAY</router-link>
                         </div>
                      </li>
                      <li class="menu-item">
                         <div class="dropdown">
                            <router-link class="menu-link link-active" to="/news">NEWS</router-link>
                         </div>
                      </li>
                      <li class="menu-item">
                         <div class="dropdown">
                            <router-link class="menu-link link-active" to="/about">ABOUT</router-link>
                         </div>
                      </li>
                      <li class="menu-item">
                         <div class="dropdown">
                            <router-link class="menu-link link-active" to="/signup">SIGN UP</router-link>
                         </div>
                      </li>
                      <li class="menu-item">
                         <div class="dropdown">
                            <router-link class="menu-link link-active" to="/login">LOG IN</router-link>
                         </div>
                      </li>
                   </ul>
                   <div class="d-flex">
                      <form id="form-searching" name="form-search" method="get" action="search.html">
                         <input onkeypress="" type="text" name="textSearch" placeholder="Search">
                         <i onclick="" class="fa-solid fa-magnifying-glass"></i>
                      </form>
                      <span class="cart-value">
                         <router-link to="/cart" class="btn-shopping_cart">
                            <i class="fa-solid fa-cart-shopping"></i>
                            <span class="cart-quantity">0</span>
                         </router-link>
                      </span>
                   </div>
                </div>
             </div>
          </div>
       </nav>
    </header>
 </template>
 
 <style>
 </style>
 
 <script>
 export default {
    name: "Header"
 };
 </script>
 