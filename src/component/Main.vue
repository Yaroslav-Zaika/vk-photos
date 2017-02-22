<template>
  <div>
    <photos
      :auth="auth"
      :photos="photos"
      :scroll="scroll"
      :stopScroll="stopScroll"
      :loading="loading"
      :albumFlag="albumFlag">
    </photos>
  </div>
</template>

<script>
  import Photos from './Photos.vue';

  export default {

    components:{
      Photos
    },
    
    props: ['auth'],
    
    data () {
      return {
        photos: [],
        value: '',
        countAll: 0,
        offset: 0,
        countSearch: 30,
        loading: false,
        scroll: false,
        stopScroll: false,
        albumFlag: false,
        version: '5.60'
      }
    },

    methods: {

      mainLoadScroll (e) {
        let w = window;
        if(w.pageYOffset > 0 &&
           w.pageYOffset + w.innerHeight >= e.target.body.scrollHeight - w.innerHeight / 2){
          this.scroll = true;
        }
      },

      photosSearch () {

        let params = {
          q: this.value,
          count: this.countSearch,
          v: this.version
        };

        if (this.offset && this.offset > 0 && this.countAll > this.offset) {
          params.offset = this.offset
        }
        
        if(this.offset && this.offset > 0 && this.countAll < this.offset) {
          this.stopScroll = true;
        }
        
        VK.Api.call('photos.search', params, r => {
          if (r.response) {
            this.countAll = r.response.count;
            this.photos =  this.photos.concat(r.response.items);
            this.offset += this.countSearch;
            this.loading = false;
          }
        });
      }

    },

    created () {

      this.$root.$on('search', value => {
        this.value = value;
        this.offset = 0;
        this.photosSearch();
      });
      
      this.$root.$on('photosSearch', () => {
        this.loading = true;
        this.scroll = false;
        this.photosSearch();
      });
      
      this.$root.$on('clean', () => {
        this.photos = [];
        this.scroll = false;
      });

      window.addEventListener('scroll', this.mainLoadScroll);
    },

    beforeDestroy () {
      this.$root.$off('search');
      this.$root.$off('photosSearch');
    }

  }
</script>

<style>
  
</style>