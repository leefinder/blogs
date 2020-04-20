<template>
    <div>
        <select v-model="selectMode">
            <option :value="4">4</option>
            <option :value="9">9</option>
            <option :value="16">16</option>
        </select>
        <button @click="resetAll">重置</button>
        <div class="row" :style="`width: ${list.length * 50}px`" v-for="(list, index) in sudokuList" :key="index">
            <div :class="`col ${id === curCol && index === curRow ? 'active' : ''}`" v-for="(item, id) in list" :key="id" @click="selectBox(list, index, id)">
                {{item}}
            </div>
        </div>
        <router-view></router-view>

        <num-area 
            v-if="showArea" 
            :selectMode="selectMode" 
            :sudokuLine="sudokuLine"
            @choiceNum="selectNum"></num-area>
    </div>
</template>
<script>
import NumArea from './components/num-area';

export default {
    data () {
        return {
            selectMode: 4,
            sudokuList: [],
            sudokuLine: [],
            showArea: false,
            curBoxPos: [],
            curCol: -1,
            curRow: -1
        }
    },
    mounted () {
        console.log(this.$router, 'router')
        console.log(this, 'this')
        this.$router.push({
            path: '/test'
        })
        this.initNumList();
    },
    methods: {
        resetAll () {
            this.initNumList()
        },
        initNumList () {
            const { selectMode } = this;
            this.sudokuList = [];
            let rLine = [];
            let cLine = [];
            for (let i = 0; i < selectMode; i++) {
                rLine[i] = [];
                cLine[i] = [];
                this.sudokuList[i] = [];
                for (let j = 0; j < selectMode; j++) {
                    rLine[i][j] = '';
                    cLine[i][j] = '';
                    this.sudokuList[i][j] = '';
                }
            }
            for (let i = 0; i < selectMode; i++) {
                for (let j = parseInt(Math.random() * selectMode); j > 0; j-=parseInt(Math.random() * 4)) {
                    this.sudokuList[i][j] = 1;
                }
            }
            
        },
        selectBox (list, index, id) {
            this.showArea = false;
            const { sudokuList, selectMode } = this;
            this.sudokuLine = [];
            for (let i = 1; i <= selectMode; i++) {
                this.sudokuLine.push(i);
            }
            const curNum = list[id]; // 当前值
            const col = sudokuList.map(item => {
                const l = item.filter((em, i) => i === id);
                const c = l.filter(item => item !== curNum);
                return c;
            })
            const row = list.filter(item => item !== curNum);
            const arr = row.concat(col.flat());
            const len = arr.length;
            for (let i = 0; i < len; i++) {
                let ii = this.sudokuLine.indexOf(arr[i]);
                if (ii !== -1) {
                    this.sudokuLine.splice(ii, 1);
                }
            }
            this.curRow = index;
            this.curCol = id;
            this.showArea = true;
            this.curBoxPos = [index, id];
        },
        selectNum (num) {
            const { curBoxPos } = this;
            const r = curBoxPos[0];
            const c = curBoxPos[1];
            this.sudokuList[r][c] = num;
            this.showArea = false;
            this.checkComplate();
        },
        checkComplate () {
            const { selectMode, sudokuList } = this;
            let count = 0;
            let r = [];
            let c = [];
            for (let i = 0; i < selectMode; i++ ) {
                r.push(sudokuList[i]); 
                c[i] = [];
                for (let j = 0; j < selectMode; j++) {
                    c[i].push(sudokuList[j][i]);
                }
            }
            for (let i = 0; i < selectMode; i++) {
                const s = sudokuList[i][i];
                const row = r[i];
                const col = c[i];
                row.forEach((item, index) => {
                    if (item === s && index !== i) {
                        count++;
                    }
                })
                col.forEach((item, index) => {
                    if (item === s && index !== i) {
                        count++;
                    }
                })
            }
            if (count === 0) {
                alert('恭喜过关');
            }
        }
    },
    watch: {
        selectMode () {
            this.initNumList();
        }        
    },
    components: {
        NumArea
    }
}
</script>
<style lang="less" scoped>
.row{
    display: flex;
    justify-content: space-between;
    justify-items: center;
    .col{
        width: 50px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #fff;
        background:darkgray;
        border-left: 1px solid #fff;
        border-top: 1px solid #fff;
    }
    .active {
        background:coral;
    }
}
</style>
