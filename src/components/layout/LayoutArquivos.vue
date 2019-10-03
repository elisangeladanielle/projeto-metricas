<template>
  <!--<iframe src="https://www.luminpdf.com/viewer/5d9563d8ecc48d00193d0887"></iframe>!-->
  <iframe src='https://drive.google.com/drive/folders/1R6R8p-2T_vzUJIqB-LgIBeFgJokVRE00.doc' width='623px' height='623px' frameborder='0'>This is an embedded <a target='_blank' href='http://office.com'>Microsoft Office</a> document, powered by <a target='_blank' href='http://drive.google.com'>Office Online</a>.</iframe>
</template>

<script>
/* eslint-disable */
export default {
  name: 'WebViewer',
  props: {
    path: String,
    url: String
  },
  mounted: function () {
        WebViewer({
            path: this.path,
            initialDoc: this.url, // replace with your own PDF file
          }, this.$refs.viewer).then((instance) => {
            // call apis here
          });
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  width: 100%;
  height: 100vh;
}
</style>
