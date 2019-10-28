<template>
<div class="card-columns">
  <div
  v-for="(item, index) in result"
  :key="index"
  class="card text-center bg-dark mb-3" style="max-width: 18rem;">
    <div
    class="card-header">Nível {{`${item.level}`}}</div>
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
        const ref = this.$firebase.database().ref(`/${window.uid}`).orderByChild("creatat");

        ref.on('value', snapshot => {
        let values = [];
        snapshot.forEach( value => {
          values.push(value.val());
        });
        //console.log(values);
          let result = [];
          let total = 0;
          var hasItem = false;
          //var level = [];
          let meta = 10;
          let index = 0;
          let addLevel = -1;
          let level = 1;

          for (let item of values) {
            //const item = values[key];
            const date = moment(item.creatat).format('MM-YYYY');
            let currentValue = 0;

            result.forEach(r => {
              if(r['date'] == date) {
                r['value'] += item.value;

                hasItem = true;
              }
            });

            if (!hasItem) {
              result.push({
                'date': date,
                'value': (item.value),

                });
            }
            hasItem = false;
            index ++;
          }

          result.forEach((r, i)=> {
            //console.log(r['value'], meta);
            if (i == addLevel) {
              level ++;
              meta += 10;
              r['level'] = level;
            }
            else{
              r['level'] = level;
            }
            r['lucro'] = r['value'] - meta;
            r['value'] = ((r['value'] * 100) / meta);
            if (r['value'] >= 100) {
              r['value'] = 100;
              addLevel = i + 1;
            }
          });

          // result.forEach(r => {
          //   if(r['value'] && r['value'] >= 100)
          //     level.push(2);
          //   else
          //     level.push(1);
          // });

          // result = result.map(r => ({ ...r, level: 1 }));

          // result = result.reduce((acc, cur) => {
          //   if (cur.value == 100) {
          //     meta = meta * ((cur.level || 0) + 1);
          //     //meta = meta * cur.level;
          //     return [
          //       ...acc,
          //       cur,
          //       {
          //         level: (cur.level || 0) + 1,
          //         date: cur.date, //mudar date depois
          //         //date: result['date'] + 1,
          //         value: 0
          //       }
          //     ];
          //   }
          //   return [...acc, cur];
          // }, []);

          //this.level = level;

          this.result = result;

          const currentMonth = moment().format('MM-YYYY');

          this.progressValue = result[currentMonth];
        });
      },
      setActiveMonth (month = null) {
        this.activeMonth = month || this.groupedMonths[this.groupedMonths.length - 1]
      }
    }
  }
</script>


<style lang="css" scoped>
.card-columns {
  color: var(--light);
  padding: 15px;
  width: 100%;
  height: 100%;
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
