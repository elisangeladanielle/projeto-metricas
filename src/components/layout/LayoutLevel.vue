<template>
<div class="card-columns">
  <div
  v-for="(item, index) in result"
  :key="index"
  class="card text-center bg-dark mb-3" style="max-width: 18rem;">
    <div
    class="card-header">Nível {{`${level}`}} </div>
    <div class="card-body">
      <h5

      class="card-title">No mês {{`${item.date}`}} você atingiu esse nível:</h5>
      <p class="card-text">Progresso:</p>
      <div id="value-progress" class="progress">
        <div

        class="progress-bar bg-success progress-bar-striped progress-bar-animated"
        role="progressbar"
        aria-valuenow="90"
        aria-valuemin="0"
        aria-valuemax="100"
        :style="progressWidth(item)">{{`${item['value']}%`}}
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import moment from 'moment'
import groupBy from 'lodash.groupby'
import ActivityListItem from '../../pages/lista-atividades/ActivityListItem'
import ListaAtividades from '../../pages/lista-atividades/ListaAtividades'
export default {
  name: 'LayoutLevel',
  components: {
    ActivityListItem,
    ListaAtividades
    },
    data: () => ({
    result: [],
    atividades: [],
    activeMonth: {},
    progressValue: 90,
    level: 0
  }),
  mounted () {
    this.getData();
  },
  computed: {

    groupedMonths () {
      let groupedMonths = []

      const addCurrentMonth = () => {
        groupedMonths.push({
          data: [],
          total: 0,
          month: moment().format('MM/YYYY')
        })
      }

      if (this.atividades.length) {
        const months = groupBy(this.atividades, i => (
          moment(i.creatat).format('MM/YYYY')
        ))

        const sortedMonths = Object.keys(months).sort((a, b) => {
          const pattern = 'MM/YYYY HH'

          return moment(`${a} 01`, pattern).isBefore(moment(`${b} 01`, pattern))
            ? -1
            : +1
        })

        groupedMonths = sortedMonths.map(month => ({
          month,
          data: months[month],
          total: months[month].map(i => +i.value).reduce((a, c) => a + c, 0)
        }))

        return groupedMonths;
      }
    },
  },
  methods: {
      progressWidth(item) {
        return `width: ${item['value']}%`;
      },
      getData () {
        const ref = this.$firebase.database().ref(`/${window.uid}`);

        ref.on('value', (snapshot) => {
          const values = snapshot.val();
          const result = [];
          let total = 0;
          var hasItem = false;
          var level = [];
          let meta = 10;
          let gatilho = 0;

          for (let key of Object.keys(values)) {
            const item = values[key];
            const date = moment(item.creatat).format('MM-YYYY');

            result.forEach(r => {
              if(r['date'] == date) {
                r['value'] += item.value;
                hasItem = true;
              }
            });
            if (!hasItem) {
              result.push({'date': date, 'value': item.value});
            }
            hasItem = false;
          }

          result.forEach(r => {
            r['value'] = (r['value'] * 100) / 10;
            r['value'] = r['value'] >= 100
              ? 100
              : r['value'];
          });

          result.forEach(r => {
            if(r['value'] && r['value'] >= 100){
              level.push(2);
              // this.level = 2
              // level.forEach(v => {

              // })
            }
            else {
              this.level = 1
              level.push(1)
            }
          })

          this.result = result;
          const currentMonth = moment().format('MM-YYYY');

          this.progressValue = result[currentMonth];
        });

        // const ref = this.$firebase.database().ref(`/${window.uid}`)

        // ref.on('value', snapshot => {
        //   console.log(snapshot.val());

        //   const result = snapshot.val();
        //   console.log(result);

          // this.atividades = Object.keys(values).map(i => values[i])
        // })
      },
      setActiveMonth (month = null) {
        this.activeMonth = month || this.groupedMonths[this.groupedMonths.length - 1]
      }
    }
  }

//let valueLevel = pegar o valor do firebase (igual do dashboard);
//let calculoValue = valueLevel - valor fazer o calculo da %
//let valueProgress = document.querySelector('#value-progress div');
//valueProgress.setAttribute('aria-valuenow', calculoValue);
//valueProgress.style.width = calculoValue;


</script>


<style lang="css" scoped>
.card-columns {
  color: var(--featured);
  padding: 15px;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @include media-breakpoint-only(lg) {
    column-count: 4;
  }
  @include media-breakpoint-only(xl) {
    column-count: 5;
  }
}
</style>
