<template>
  <div>
    <div class="photos" v-if="showPhotos">
      <div class="photo" v-for="photo in photos">
        <div class="image"
        @click="showPhotos = false">
         <router-link
          v-if="!albumFlag"
          :to="{name: 'photo', params: {photo_id: photo.id, owner_id: photo.owner_id, album_id: photo.album_id}}">
           <img :src="photo.photo_807 || photo.photo_604" alt="">
         </router-link>
         <router-link
          v-if="albumFlag"
          :to="{name: 'albumPhoto', params: {photo_id: photo.id, owner_id: photo.owner_id, album_id: photo.album_id}}">
           <img :src="photo.photo_807 || photo.photo_604" alt="">
         </router-link>
        </div>
        <div class="details">
          <div v-if="!albumFlag">
            <router-link class="link" :to="{name: 'album', params: {owner_id: photo.owner_id, album_id: photo.album_id}}">К альбому</router-link>
          </div>
        </div>
      </div>
      <div class="clear"></div>
      <mugen-scroll class="center" v-if="scroll && !stopScroll" :handler="more" :should-handle="!loading">
        <div id="circularG">
          <div id="circularG_1" class="circularG"></div>
          <div id="circularG_2" class="circularG"></div>
          <div id="circularG_3" class="circularG"></div>
          <div id="circularG_4" class="circularG"></div>
          <div id="circularG_5" class="circularG"></div>
          <div id="circularG_6" class="circularG"></div>
          <div id="circularG_7" class="circularG"></div>
          <div id="circularG_8" class="circularG"></div>
        </div>
      </mugen-scroll>
    </div>
    <router-view :albumFlag="albumFlag" :auth="auth"></router-view>
  </div>
</template>

<script>
  import '../css/loading.css';
  import Modal from './Modal.vue';
  import MugenScroll from 'vue-mugen-scroll';

  export default {

    components: { 
      Modal,
      MugenScroll
    },

    props: ['auth', 'photos', 'scroll', 'stopScroll', 'loading', 'albumFlag'],

    data () {
      return {
        showPhotos: true
      }
    },

    methods: {
      
      more () {
        if(this.albumFlag){
          this.$root.$emit('getAlbum');
        } else {
          this.$root.$emit('photosSearch');
        }
      }
      
    },
    
    created () {
      this.$root.$on('modalClose', () => {
        this.showPhotos = true;
      });
    },
    
    beforeDestroy () {
      this.$root.$off('modalClose');
      this.showPhotos = true;
    }
    
  }
</script>

<style lang="scss">
  
  .photos {
    max-width: 960px;
    width: 100%;
    margin: 0 auto;
    
    img {
      cursor: pointer;
    }
    
    .photo {
      float: left;
      height: 400px;
      width: 100%;
      max-width: 308px;
      padding: 15px 2px 35px;
      
      .image {
        height: 100%;
        width: 100%;
      }
      
      .details {
        text-align: center;
        margin-top: 7px;
      }
      
      img {
        height: 100%;
        max-width: 308px;
        margin: 0 auto;
        display: block;
      }
    }
  }
  
  @media screen and (max-width: 960px) {
    .photos {
      max-width: 628px;
      width: 100%;
      margin: 0 auto;
    }
  }
  
  @media screen and (max-width: 660px) {
    .photos {
      max-width: 312px;
      width: 100%;
      margin: 0 auto;
    }
  }

</style>