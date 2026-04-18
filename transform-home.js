const fs = require('fs');
let html = fs.readFileSync('g:/Code/Github/web-figure/stitch-home.html', 'utf8');

const ejsHead = `<% const pageSeo = typeof seo !== 'undefined' && seo ? seo : {}; %>
<!DOCTYPE html>
<html class="light" lang="vi">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title><%= pageSeo.title || title || 'PMFigure' %></title>
    <meta name="description" content="<%= pageSeo.description || 'PMFigure - cửa hàng figure anime, mô hình sưu tầm và quà tặng dành cho người yêu thích nhân vật.' %>" />
    <% if (pageSeo.keywords) { %><meta name="keywords" content="<%= pageSeo.keywords %>" /><% } %>
    <meta property="og:locale" content="<%= pageSeo.ogLocale || 'vi_VN' %>" />
    <meta property="og:type" content="<%= pageSeo.ogType || 'website' %>" />
    <meta property="og:title" content="<%= pageSeo.title || title || 'PMFigure' %>" />
    <meta property="og:description" content="<%= pageSeo.description || 'PMFigure - cửa hàng figure anime, mô hình sưu tầm và quà tặng dành cho người yêu thích nhân vật.' %>" />
    <meta property="og:site_name" content="PMFigure" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="<%= pageSeo.title || title || 'PMFigure' %>" />
    <meta name="twitter:description" content="<%= pageSeo.description || 'PMFigure - cửa hàng figure anime, mô hình sưu tầm và quà tặng dành cho người yêu thích nhân vật.' %>" />
    <% if (pageSeo.canonicalUrl) { %><link rel="canonical" href="<%= pageSeo.canonicalUrl %>" /><meta property="og:url" content="<%= pageSeo.canonicalUrl %>" /><% } %>
    <link rel="icon" href="/favicons/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
    <link rel="manifest" href="/favicons/manifest.webmanifest" />`;

html = html.replace(/<!DOCTYPE html>\s*<html class="light" lang="en"><head>/, ejsHead);
html = html.replace(/<meta charset="utf-8"\/>/, '');
html = html.replace(/<meta content="width=device-width, initial-scale=1.0" name="viewport"\/>/, '');
html = html.replace(/<title>.*?<\/title>/, '');

// Fix TopNavBar
html = html.replace('<div class="text-2xl font-bold italic text-pink-600 dark:text-pink-400">Pick Miu</div>', '<div class="text-2xl font-bold italic text-pink-600 dark:text-pink-400"><a href="/" style="text-decoration:none;color:inherit;">PMFigure</a></div>');
html = html.replace('<div class="hidden md:flex flex-1 max-w-xl mx-8 relative">', '<form class="hidden md:flex flex-1 max-w-xl mx-8 relative" method="get" action="/san-pham">');
html = html.replace('<input class="', '<input name="q" class="');
html = html.replace('</div>\n<div class="flex items-center gap-6">', '</form>\n<div class="flex items-center gap-6">');

html = html.replace(/Active: scale/g, 'active:scale');

const mobileSearchBtn = `<a href="/san-pham" class="text-zinc-500 dark:text-zinc-400 hover:text-pink-400 hover:opacity-80 transition-opacity active:scale-95 duration-200 ease-in-out md:hidden flex">
<span class="material-symbols-outlined" data-icon="search">search</span>
</a>`;
html = html.replace(/<button class="[^"]*md:hidden">[\s\S]*?<\/button>/, mobileSearchBtn);

const cartBtn = `<a href="/giohangs" class="text-zinc-500 dark:text-zinc-400 hover:text-pink-400 hover:opacity-80 transition-opacity active:scale-95 duration-200 ease-in-out relative block">
<span class="material-symbols-outlined" data-icon="shopping_cart">shopping_cart</span>
<% if (typeof cartCount !== 'undefined' && cartCount > 0) { %>
<span class="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center"><%= cartCount %></span>
<% } %>
</a>`;
html = html.replace(/<button class="[^"]*relative">[\s\S]*?<\/button>/, cartBtn);

const profileBtn = `<a href="<%= (typeof user !== 'undefined' && user) ? '/ho-so' : '/dang-nhap' %>" class="text-zinc-500 dark:text-zinc-400 hover:text-pink-400 hover:opacity-80 transition-opacity active:scale-95 duration-200 ease-in-out hidden md:block">
<span class="material-symbols-outlined" data-icon="person">person</span>
</a>`;
html = html.replace(/<button class="[^"]*md:block">[\s\S]*?<\/button>/, profileBtn);

// Section Banner links
html = html.replace(/<div class="rounded-xl overflow-hidden h-\[250px\] relative group cursor-pointer">/g, '<a href="/san-pham" class="block rounded-xl overflow-hidden h-[250px] relative group cursor-pointer">');
const bannerSectionMatch = html.match(/<section class="grid grid-cols-1 md:grid-cols-2 gap-6">([\s\S]*?)<\/section>/)[1];
let modifiedBanner = bannerSectionMatch.replace(/<\/div>\s*<a href="\/san-pham"/, '</a>\n<a href="/san-pham"');
modifiedBanner = modifiedBanner.replace(/<\/div>\s*$/, '</a>\n');
html = html.replace(bannerSectionMatch, modifiedBanner);

// Circular Categories
const circCatSection = `
<div class="flex justify-between items-end mb-8">
<h2 class="font-headline text-2xl font-bold text-on-surface">Danh Mục</h2>
<a class="font-body text-sm text-primary hover:text-primary-container font-medium" href="/san-pham" style="text-decoration:none;">Xem tất cả</a>
</div>
<div class="flex overflow-x-auto gap-8 pb-4 no-scrollbar">
<% if (categoriesWithProducts && categoriesWithProducts.length) { %>
  <% categoriesWithProducts.forEach((category) => { 
      let catImg = '';
      if (category.products && category.products.length > 0 && category.products[0].hinh_anh) {
          catImg = category.products[0].hinh_anh.startsWith('/') ? category.products[0].hinh_anh : '/uploads/' + category.products[0].hinh_anh;
      }
  %>
  <a href="/san-pham?the_loai_id=<%= category.id %>" class="flex flex-col items-center gap-3 min-w-[80px] group cursor-pointer" style="text-decoration:none;">
    <div class="w-20 h-20 rounded-full bg-surface-container-lowest p-1 shadow-sm ring-2 ring-surface-variant group-hover:ring-primary-container transition-all">
      <% if (catImg) { %>
        <img class="w-full h-full object-cover rounded-full" src="<%= catImg %>" alt="<%= category.ten %>"/>
      <% } else { %>
        <div class="w-full h-full rounded-full bg-surface-dim"></div>
      <% } %>
    </div>
    <span class="font-body text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors text-center line-clamp-1"><%= category.ten %></span>
  </a>
  <% }) %>
<% } %>
</div>
`;
html = html.replace(/<section>\s*<div class="flex justify-between items-end mb-8">[\s\S]*?<\/div>\s*<\/section>/, '<section>' + circCatSection + '</section>');

// Product Sections
let productSectionsStr = `<% if (categoriesWithProducts && categoriesWithProducts.length) { %>
<% categoriesWithProducts.forEach((category) => { %>
<% if (category.products && category.products.length > 0) { %>
<section class="mb-12">
<div class="mb-6 flex justify-between items-center">
<span class="bg-primary text-on-primary font-headline font-bold text-lg px-6 py-2 rounded-r-full inline-block shadow-md"><%= category.ten %></span>
<a href="/san-pham?the_loai_id=<%= category.id %>" class="font-body text-sm text-primary hover:text-primary-container font-medium pr-4" style="text-decoration:none;">Xem thêm <%= category.ten %> &rarr;</a>
</div>
<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
<% category.products.forEach((p) => { %>
<div class="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group border border-surface-variant h-full">
<a href="/san-pham/<%= p.id %>" class="flex flex-col h-full focus:outline-none" style="text-decoration:none;color:inherit;">
<div class="relative pt-[100%] overflow-hidden bg-surface-container-low">
<% if (p.hinh_anh) { %>
<img alt="<%= p.ten %>" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="<%= p.hinh_anh.startsWith('/') ? p.hinh_anh : ('/uploads/' + p.hinh_anh) %>"/>
<% } else { %>
<div class="absolute inset-0 w-full h-full bg-surface-dim group-hover:scale-105 transition-transform duration-500"></div>
<% } %>
</div>
<div class="p-4 flex flex-col flex-1">
<h4 class="font-body text-sm text-on-surface-variant mb-2 line-clamp-2"><%= p.ten %></h4>
<div class="mt-auto block w-full">
<div class="text-xs text-on-surface-variant mb-1">Tồn kho: <%= Number(p.ton_kho || 0) %></div>
<div class="font-headline font-bold text-primary text-lg mb-3"><%= Number(p.gia || 0).toLocaleString('vi-VN') %>đ</div>
<button class="w-full bg-primary-container/20 text-primary hover:bg-primary hover:text-on-primary font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 pointer-events-none">
<span class="material-symbols-outlined text-sm" data-icon="shopping_bag">shopping_bag</span>
Chọn mua
</button>
</div>
</div>
</a>
</div>
<% }) %>
</div>
</section>
<% } %>
<% }) %>
<% } %>`;

const productSectionMatch = html.match(/<!-- 6\. Product Section -->\s*<section>[\s\S]*?<\/section>/)[0];
html = html.replace(productSectionMatch, '<!-- 6. Product Section -->\n' + productSectionsStr);

// Fix BottomNavBar (Mobile Only)
let bottomNavHtml = html.match(/<nav class="bg-white\/90[^>]*>([\s\S]*?)<\/nav>/)[1];

let newBottomNav = `<a href="/" class="flex flex-col items-center justify-center text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20 rounded-xl px-4 py-1 hover:text-pink-300 active:scale-90 duration-150" style="text-decoration:none;">
<span class="material-symbols-outlined mb-1" data-icon="home" data-weight="fill">home</span>
<span>Home</span>
</a>
<a href="/san-pham" class="flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 hover:text-pink-300" style="text-decoration:none;">
<span class="material-symbols-outlined mb-1" data-icon="grid_view">grid_view</span>
<span>Category</span>
</a>
<a href="/giohangs" class="flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 hover:text-pink-300 relative" style="text-decoration:none;">
<span class="material-symbols-outlined mb-1" data-icon="shopping_bag">shopping_bag</span>
<span>Cart</span>
<% if (typeof cartCount !== 'undefined' && cartCount > 0) { %>
<span class="absolute top-0 right-2 bg-primary text-on-primary text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center"><%= cartCount %></span>
<% } %>
</a>
<a href="<%= (typeof user !== 'undefined' && user) ? '/ho-so' : '/dang-nhap' %>" class="flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 hover:text-pink-300" style="text-decoration:none;">
<span class="material-symbols-outlined mb-1" data-icon="person">person</span>
<span>Profile</span>
</a>`;
html = html.replace(bottomNavHtml, newBottomNav);

html = html.replace(/<style>/, `<style>a { text-decoration: none !important; } `);

fs.writeFileSync('g:/Code/Github/web-figure/src/views/client/home.ejs', html);
console.log('Done!');
