<template>
  <div class="activity-list-item row">
    <div class="col-10">
      <div class="description">
        <span>{{ data.description }}</span>
        <button
          v-if="data.receipt"
          class="btn btn-sm btn-outline-primary"
          @click="openReceipt()"
        >
          <i class="fa fa-paperclip"></i>
          Ver arquivo correspondente
          <i class="fa fa-external-link-alt"></i>
        </button>
      </div>
      <small v-date-format="data.creatat"/>
    </div>
    <div class="col-2">{{ data.value + ` vezes por mês` }}</div>
  </div>
</template>

<script>
export default {
  props: {
    data: { type: Object, required: true }
  },
  methods: {
    openReceipt () {
      window.open(this.data.receipt, '_blank')
    }
  }
}
</script>

<style scoped lang="scss">
  .activity-list-item {
    padding-top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--dark-medium);
    .description {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
</style>
