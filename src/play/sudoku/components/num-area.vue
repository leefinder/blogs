<template>
    <div>
        <div class="n-row" :style="`width: ${w * 50}px`" v-for="(list, index) in numList" :key="index">
            <div :class="`n-col ${item.isDisabled ? 'disabled' : ''}`" v-for="(item, id) in list" :key="id"
            @click="choiceNum(item)">
                {{item.num}}
            </div>
        </div>
        <div class="cancel" :style="`width: ${w * 50}px`" @click="clearAll">清空</div>
    </div>
</template>
<script>
export default {
    props: ['selectMode', 'sudokuLine'],
    data () {
        return {
            numList: []
        }
    },
    mounted() {
        this.getNumList();
    },
    computed: {
        w () {
            return Math.sqrt(this.selectMode);
        }
    },
    methods: {
        choiceNum({num, isDisabled}) {
            if (!isDisabled) {
                this.$emit('choiceNum', num);
            }
        },
        clearAll () {
            this.$emit('choiceNum', '');
        },
        getNumList () {
            const { selectMode, sudokuLine } = this;
            const arr = new Array(selectMode).fill(1).map((item, index) => {
                return {
                    num: index + 1,
                    isDisabled: true
                };
            })
            arr.forEach((item, i) => {
                sudokuLine.forEach((em, j) => {
                    if (item.num === em) {
                        arr[i].isDisabled = false;
                    }
                })
            })
            let arr2L = [];
            let len = arr.length;
            let l;
            while(len) {
                l = arr.splice(len - this.w);
                arr2L.unshift(l);
                len-=this.w;
            }
            this.numList = arr2L;
        }
    }
}
</script>
<style lang="less" scoped>
.n-row{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .n-col{
        width: 50px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #fff;
        background:deepskyblue;
        border-left: 1px solid #fff;
        border-top: 1px solid #fff;
    }
    .disabled{
        background: #ccc;
    }
}
.cancel{
    height: 50px;
    line-height: 50px;
    text-align: center;
    background: #ff0000;
    color: #fff
}
</style>
