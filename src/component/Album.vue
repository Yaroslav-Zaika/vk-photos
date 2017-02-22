<template>
  <div v-if="auth">
    <photos
      :auth="auth"
      :photos="photos"
      :stopScroll="stopScroll"
      :scroll="scroll"
      :loading="loading"
      :albumFlag="albumFlag">
    </photos>
  </div>
</template>

<script>
  import Photos from './Photos.vue';

  export default {

    components: {
      Photos
    },
    
    props: ['auth'],

    data () {
      return {
        albumFlag: true,
        photos: [],
        countAll: 0,
        offset: 0,
        countSearch: 30,
        loading: false, 
        scroll: false,
        stopScroll: false,
        version: '5.60'
      }
    },

    methods: {

      albumLoadScroll (e) {
        let w = window;
        if(w.pageYOffset + w.innerHeight >= e.target.body.scrollHeight - w.innerHeight / 2){
          this.scroll = true;
        }
      },

      getAlbum () {

        if(this.$route.params.owner_id && this.$route.params.album_id){

          if (this.offset && this.offset > 0 && this.countAll < this.offset) {
            this.stopScroll = true;
          }

          let params = {
            owner_id: this.$route.params.owner_id,
            album_id: this.$route.params.album_id,
            count: this.countSearch,
            offset: this.offset,
            v: this.version
          };

          VK.Api.call('photos.get', params, r => {
            
            if (r.response) {
              this.countAll = r.response.count;
              this.photos = this.photos.concat(r.response.items);
              this.offset += this.countSearch;
            }
            
            this.loading = false;
            
          });
        }

      }

    },

    created () {
      
      this.getAlbum();
      
      this.$root.$on('getAlbum', () => {
        this.loading = true;
        this.scroll = false;
        this.getAlbum();
      });
      
      window.addEventListener('scroll', this.albumLoadScroll);
    },
    
    beforeDestroy () {
      this.$root.$off('getAlbum');
    }

  }
</script>

<style>
  
</style>