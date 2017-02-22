<template>
  <div v-if="auth">
    <transition name="modal">
      <div class="modal-mask">
        <div class="modal-default-button" v-if="!albumFlag"  @click="$router.replace('/')"></div>
        <div class="modal-default-button" v-if="albumFlag"
         @click="$router.replace({name: 'album', params: {owner_id: photo.owner_id, album_id: photo.album_id}})">
       </div>
        <div class="modal-wrapper">
          <div class="modal-container">
            <div class="modal-body">
              <div class="modal-left">
                <img :src="photo.photo_604">
              </div>
              <div class="modal-right">
                <vue-scrollbar custom-class="my-scrollbar" ref="Scrollbar">
                  <div class="scroll-me">
                    <div class="user" v-if="user">
                      <img :src="user.photo_50 || user.photo_75 || user.photo_130" alt="">
                      <div class="author-info">
                        <a :href="'https://vk.com/id' + user.id">{{user.first_name}} {{user.last_name}}</a>
                        <div>{{photo.date}}</div>
                      </div>
                    </div>
                    <div class="group" v-if="group">
                      <img :src="group.photo_50 || group.photo_100 || group.photo_200" alt="">
                      <a :href="'https://vk.com/' + group.screen_name">{{group.name}}</a>
                    </div>
                    <div class="like" v-if="photo">
                      <div class="icon"></div>
                      <div class="count">{{photo.likes.count}}</div>
                    </div>
                    <div class="comments">
                      <div class="comment" v-for="comment in comments">
                        <div class="box left">
                          <img class="ava" v-if="comment.profile"
                            :src="comment.profile.photo_50 || comment.profile.photo_75 || comment.profile.photo_100 || user.photo_130" alt="">
                          <img class="ava" v-if="comment.group"
                            :src="comment.group.photo_50 || comment.group.photo_100 || comment.group.photo_150" alt="">
                        </div>
                        <div class="content">
                          <div class="box profiles">
                            <a :href="'https://vk.com/id' + comment.profile.id" v-if="comment.profile">{{comment.profile.first_name}} {{comment.profile.last_name}}</a>
                            <a :href="'https://vk.com/' + group.screen_name" v-if="comment.group">{{comment.group.name}}</a>
                          </div>
                          <div class="box block">
                              <a class="link-user" 
                                v-if="comment.reply_to_user && comment.reply_to_user_name"
                                :href="'https://vk.com/id' + comment.reply_to_user">{{comment.reply_to_user_name}}</a>{{comment.text}}
                          </div>
                          <div class="footer">
                            <div class="left">{{comment.date}}</div>
                            <div>
                              <div class="right">{{comment.likes.count}}</div>
                              <div class="icon-like right"></div>
                              <div class="clear"></div>
                            </div>
                            <div class="clear"></div>
                          </div>
                          <div class="clear"></div>
                        </div>
                      </div>
                    </div>
                    <div class="no-comments" v-if="limitedComments || noComments">
                      <div class="no-rows" v-if="limitedComments">Возможность комментирования этой фотографии ограничена.</div>
                      <div class="no-rows" v-if="noComments">Будьте первым, кто оставит комментарий к этой фотографии.</div>
                    </div>
                  </div>
                </vue-scrollbar>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import '../css/scrollbar.css';
  import VueScrollbar from 'vue2-scrollbar';
  
  export default {
    
    components: { VueScrollbar },
    
    props: ['auth', 'albumFlag'],
    
    data () {
      return {
        photo: '',
        user: null,
        group: null,
        comments: [],
        noComments: false,
        limitedComments: false,
        version: '5.60'
      }
    },
    
    methods: {
      
      whose () {
        
        if(this.$route.params.owner_id > 0){
          
          VK.Api.call('users.get', {
            user_ids: this.$route.params.owner_id,
            name_case: 'Nom',
            fields: 'photo_50',
            v: this.version
          }, r => {
            
            if (r.response) {
              this.user = r.response[0];
              this.user.first_name = this.user.first_name.substr(0, 10);
              this.user.last_name = this.user.last_name.substr(0, 10);
            }
            
          });
          
        } else if (this.$route.params.owner_id < 0) {
          
          VK.Api.call('groups.getById', {
            group_ids: this.$route.params.owner_id.toString().substr(1),
            v: this.version
          }, r => {
            
            if (r.response) {
              this.group = r.response[0];
              this.group.name = this.group.name.substr(0, 30);
            }
            
          });
          
        }
        
      },

      getById () {
        
        VK.Api.call('photos.getById', {
          photos: this.$route.params.owner_id + '_' + this.$route.params.photo_id,
          extended: 1,
          v: this.version
        }, r => {
          
          if (r.response) {
            this.photo = r.response[0];
            this.photo.date = this.convertDate(r.response[0].date);
          }
          
        });
        
      },

      getComments () {
        
        VK.Api.call('photos.getComments', {
          owner_id: this.$route.params.owner_id,
          photo_id: this.$route.params.photo_id,
          need_likes: 1,
          extended: 1,
          v: this.version
        }, r => {
          
          if (r.response && r.response.count > 0 && r.response.items.length){
            let obj;
            this.comments = r.response.items;
            
            this.comments.forEach( comment => {
              comment.date = this.convertDate(comment.date);

              if(comment && comment.reply_to_user){
                obj = {};
                obj.text = comment.text.split('], ');

                if(obj.text.length === 2){
                  obj.reply_to_user_name =  obj.text[0].split('|');
                  comment.text = ', ' + obj.text[1];
                  comment.reply_to_user_name = obj.reply_to_user_name[1];
                }
              }
              
              r.response.groups.some( group => {
                if(comment.from_id == '-' + group.id){
                  comment.group = group;
                  return true;
                }
              });
              
              r.response.profiles.some( profile => {
                if(comment.from_id === profile.id){
                  comment.profile = profile;
                  return true;
                }
              });
              
            });
            
          } else if (r.response && r.response.count === 0){
            this.noComments = true;
          } else if (r.error && r.error.error_code === 7) {
            this.limitedComments = true;
          }
          
        });
        
      },
      
      convertDate (time) {
        let date = new Date(time * 1000);
        let toLocaleString = date.toLocaleString('ru', {day: 'numeric', month: 'short'});
        return toLocaleString.slice(0, -1) + ' ' + date.getFullYear();
      }
    },
    
    created () {
      this.getById();
      this.getComments();
      this.whose();
    },
    
    beforeDestroy () {
      this.$root.$emit('modalClose');
    }
    
  }
</script>

<style lang="scss">

  .user, .group {
    height: 40px;
    padding: 13px 20px 10px 15px;
    background-color: #fafbfc;
    
    img {
      float: left;
      height: 40px;
      width: 40px;
      padding-right: 10px;
    }
    
    .author-info {
      overflow: hidden;
      
      div {
        color: #999c9f;
        margin-top: 4px;
        font-size: 13px;
      }
    }
  }
  
  .like {
    height: 25px;
    padding: 16px 0px 14px 30px;
    border-top: 1px solid #e7e8ec;
    border-bottom: 1px solid #e7e8ec;
    
    .icon {
      background: url(../img/post_icon.png?6) no-repeat 0 5px;
      float: left;
      width: 20px;
      height: 20px;
    }
    
    .count {
      padding: 2px 0;
    }
  }
  
  .comment {
    border-bottom: 1px solid #e7e8ec;
    padding: 10px 20px 10px 15px;
    font-size: 13px;
    line-height: 1.308;
    
    .profile {
      width: 80%;
      
      a {
        font-weight: 500;
      }
    }
    
    .block {
      word-wrap: break-word;
    }
    
    .left {
      float: left;
    }
    
    .right {
      float: right;
    }
    
    .content {
      margin-left: 45px;
    }
    
    .footer {
      height: 17px;
      
      div {
        color: #999c9f;
        font-size: 13px;
      }
      
      .icon-like {
        height: 10px;
        width: 12px;
        margin: 3px 3px 0;
        background: url(../img/post_icon.png?6) no-repeat 0 -29px;
      } 
    }
    
    .text {
      margin-right: 5px;
    }
    
    .box {
      
      .link-user {
        color: #000;
      }
      
      img {
        margin-right: 10px;
      }
    }
    
    .ava {
      height: 34px;
      width: 34px;
      display: inline-block;
    }
  }
  
  .comment:last-child {
    border-bottom: none;
  }
  
  .no-comments {
    margin-top: 77.5px;

    .no-rows {
      background: url(../img/first_comment.png) no-repeat 0 0;
      background-position: center 0;
      font-size: 13px;
      text-align: center;
      color: #939393;
      padding: 80px 30px 0;
    } 
  } 
  
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .7);
    display: table;
    transition: opacity .3s ease;
  }

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  .modal-container {
    max-width: 900px;
    width: 100%;
    margin: 0px auto;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: -apple-system,BlinkMacSystemFont,Roboto,Open Sans,Helvetica Neue,sans-serif;
  }

  .modal-body {
    margin: auto 0;
    height: 500px;
  }

  .modal-body .modal-left {
    max-width: 600px;
    width: 100%;
    height: 500px;
    float: left;
    background-color: #1e1e1e;
  }

  .modal-body .modal-left img{
    display: block;
    margin: 0 auto;
    height: 500px;
    max-width: 600px;
  }

  .modal-body .modal-right{
    width: 300px;
    height: 500px;
    float: right;
    background: #fff;
  }
  
  .modal-default-button {
    position: fixed;
    background-image: url(../img/pv_layer_controls.png);
    width: 16px;
    height: 16px;
    top: 12px;
    right: 12px;
    background-position: -3px 0px;
    opacity: 0.5;
    -o-transition: opacity 100ms linear;
    transition: opacity 100ms linear;
    cursor: pointer;
  }
  
  .modal-default-button:hover {
    opacity: 1;
  }
  
  .modal-enter {
    opacity: 0;
  }

  .modal-leave-active {
    opacity: 0;
  }

  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
  
  @media screen and (max-width: 960px) {
    
    .user, .group {
      height: 65px;
    }

    .modal-container {
      max-width: 800px;
      width: 100%;
      margin: 0px auto;
    }
    
    .modal-body .modal-left {
      
      width: 65%;
      height: 500px;
      float: left;
      background-color: #1e1e1e;
    }

    .modal-body .modal-left img{
      display: block;
      margin: 0 auto;
      height: 500px;
      max-width: 100%;
    }

    .modal-body .modal-right{
      width: 35%;
      height: 500px;
      float: right;
      background: #fff;
    }
  }
  
  @media screen and (max-width: 660px) {
     
    .modal-mask {
      padding: 10px 0;
      position: static;
      z-index: 9998;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .7);
      display: table;
      transition: opacity .3s ease;
    }

    .modal-container {
      max-width: 500px;
      width: 80%;
      margin: 0px auto;
      
      .modal-body {
        margin: auto 0;
        height: 100%;
        max-width: 100%;
      }
      
      .modal-body .modal-left {
        height: 100%;
        width: 100%;
        float: none;
        background-color: #1e1e1e;
      }

      .modal-body .modal-left img{
        display: block;
        margin: 0 auto;
        height: 100%;
        max-width: 100%;
      }

      .modal-body .modal-right{
        width: 100%;
        height: 100%;
        float: none;
        background: #fff;
      }
    }
  }
  
</style>