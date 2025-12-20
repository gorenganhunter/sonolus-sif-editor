<script setup lang="ts">
import { computed } from 'vue'
import { view } from '../editor/view'
// import { rotate, resize, transparent, moveX, moveY } from './events'
import { getLane, getLaneCenter, laneLayout } from './lane'
import { transform } from './projection'
// import { stages } from '../history/stages'
import { Vec } from "./Vec"

const stages2 = computed(() =>
    [0,1,2,3,4,5,6,7,8]
    .map(lane => {
        // lane -= 4
		// let angle = (210 + 120 * lane / (9 - 1)) * Math.PI / 180;
		//       const v = new Vec(-1, 0).rotate(angle)
		//       const layout = new Vec(0, 0).add(v.x, v.y)
        lane -= 4
        const v = new Vec(0, 1).rotate(-lane * Math.PI / 8)
        const layout = new Vec(0, 0).add(v.x, v.y)
		      return {
		          cx: layout.x,
		          cy: layout.y
		      }
//            const [l, r] = getLane(lane, 1, shift.value, rotate.value)

//            const targetTime = timeToScaledTime(timeScales.value, beatToTime(bpms.value, beat))
//            const z = unlerp(targetTime - noteDuration.value, targetTime, scaledTimes.value.min)

            // const points = new Quad().rotate((rotate(id).value % 360) / 180 * Math.PI).mul(resize(id).value / 2).translate(moveX(id).value, moveY(id).value).toPoints()
            //
            // return {
            //     points,
            //     opacity: transparent(id).value
            // }
        })
)
// const lanes = computed(() =>
//     ([{
//         points: laneLayout(...getLane(0, 1, shift.value, rotate.value)),
//         centers: [...Array(4).keys()].map((i) => 
//             transform(getLaneCenter(i, 1, shift.value, rotate.value), 0)
//     )}]))

</script>

<template>
    <template v-for="({ cx, cy }, index) in stages2" :key="index">
        <circle :cx :cy :r="0.1" stroke="#fff" stroke-width="0.02"/>
        <!--polygon :points stroke="white" :stroke-opacity="opacity" /-->
    </template>
    <!--template v-for="({ points, centers }, index) in lanes" :key="index">
        <polygon :points stroke="white" />
        <template v-for="({ x, y }, i) in centers" :key="i">
            <text
                :x
                :y="-y"
                text-anchor="middle"
                dominant-baseline="middle"
                transform="scale(1, -1)"
                fill="white"
                :fill-opacity="i === view.hoverLane ? 1 : 0.5"
            >
                {{ i }}
            </text>
        </template>
    </template-->
</template>
