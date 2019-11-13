<template>
  <div class="home">
    <div class="row">
      <div class="col-6 home-box">
        <small>Total de atividades inseridas:</small>
        <div class="money">{{parseFloat(totals.totalSpent)}}</div>
        <small>
        </small>
      </div>
      <div class="col-6 home-box">
        <small>A média de atividades é de:</small>
        <div class="money">{{parseFloat(totals.average).toFixed(1)}}</div>
      </div>
      <div class="col-6 home-box">
        <small>A maior frequência de atividades foi de:</small>
        <div class="money">{{parseFloat(totals.biggest.value)}}</div>
        <small v-date-format="totals.biggest.creatat"/>
      </div>
      <div class="col-6 home-box">
        <small>A menor frequência de atividades foi de:</small>
        <div class="money">{{parseFloat(totals.lowest.value)}}</div>
        <small v-date-format="totals.lowest.creatat"/>
      </div>
    </div>
   </div>
</template>

<script>
export default {
  name: 'Home',
  data: () => ({
    atividades: []
  }),
  created () {
    this.getData()
  },
  computed: {
    totals () {
      const { atividades: exp } = this
      const values = {
        totalSpent: 0,
        average: 0,
        biggest: {},
        lowest: {}
      }

      if (exp.length) {
        values.totalSpent = exp.map(e => +e.value)
          .reduce((acc, cur) => acc + cur, 0)

        values.average = values.totalSpent / exp.length

        values.biggest = exp.sort((a, b) => +b.value - +a.value)[0]
        values.lowest = exp.sort((a, b) => +a.value - +b.value)[0]
      }

      return values
    }
  },
  methods: {
    getData () {
      const ref = this.$firebase.database().ref(`/${window.uid}`)

      ref.on('value', data => {
        const values = data.val()
        this.atividades = Object.keys(values).map(i => values[i])
        // console.log(Object.keys(values).map(i => values[i]))
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .home {
    padding: 15px;
    .home-box {
      width: 100%;
      display: flex;
      font-size: 30pt;
      flex-direction: column;
      align-items: center;
      height: calc(50vh - 15px);
      justify-content: center;
      border: 1px solid var(--dark-medium);
      small {
        font-size: 1.3rem;
      }
      .money {
        color: var(--featured);
      }
      &:nth-child(2), &:nth-child(4) {
        border-left: none;
      }
      &:nth-child(3), &:nth-child(4) {
        border-top: none;
      }
    }
  }

  // .home .home-box:nth-child(),
</style>
