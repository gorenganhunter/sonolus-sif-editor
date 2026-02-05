<script setup lang="ts">
import { computed } from 'vue'
import { beats, times, keys, scaledTimes } from '.'
// import { colors } from '../colors'
import { bpms } from '../history/bpms'
import { cullEntities } from '../history/store'
import { timeScales } from '../history/timeScales'
import { beatToTime } from '../state/integrals/bpms'
// import { timeToScaledTime } from '../state/integrals/timeScales'
import { lerp, unlerp, clamp } from '../utils/math'
import { state } from "../history"
// import { rotate, resize, moveX, moveY } from './events'
import { getLane } from './lane'
import { noteDuration, tapNoteLayout, approach } from './note'
import { Vec } from "./Vec"
import { Quad } from "./Quad"

const connectors = computed(() =>
    [...cullEntities('connector', keys.value.min, keys.value.max)]
        .filter(({ head, tail }) => head.lane === tail.lane)
        .filter(({ head, tail }) => tail.beat >= beats.value.min || head.beat < beats.value.max)
        .sort((a, b) => b.beat - a.beat)
        .map(({ head, tail }) => {
        // let layout = new Quad(
        //     {x: -size * (1 + 0.08 * Math.abs((lane % 1) - 0.5 - size / 2)),
        //     y: -0.02},
        //     {x: -size * (1 - 0.08 * Math.abs((lane % 1) - 0.5 - size / 2)),
        //     y: 0.02},
        //     {x: size * (1 - 0.08 * Math.abs((lane % 1) - 0.5 + size / 2)),
        //     y: 0.02},
        //     {x: size * (1 + 0.08 * Math.abs((lane % 1) - 0.5 + size / 2)),
        //         y: -0.02}
        // )
        //
        const targetTime = {
            head: beatToTime(bpms.value, head.beat),
            tail: beatToTime(bpms.value, tail.beat)
        }
        //     //const z = unlerp(targetTime - noteDuration.value, targetTime, scaledTimes.value.min)
        //
        //
        // const angle = (rotate(group).value % 360) / 180 * Math.PI
        // const size2 = resize(group).value
        // const posX = moveX(group).value
        // const posY = moveY(group).value
        //
            const s = {
                head: clamp(unlerp(targetTime.head - noteDuration.value, targetTime.head, times.value.min)),
                tail: clamp(unlerp(targetTime.tail - noteDuration.value, targetTime.tail, times.value.min)),
            }
        // // console.log(s, angle, size2, posX, posY)
        //
        // const rotate2 = angle + (Math.PI / 2 * Math.floor(lane))
        // let cx = posX - size2 * s / 2 * Math.sin(-rotate2) + ((lane % 1) - 0.5) * size2 * s * Math.cos(rotate2)
        // let cy = posY - size2 * s / 2 * Math.cos(rotate2) - ((lane % 1) - 0.5) * size2 * s * Math.sin(-rotate2)
        //
        // // console.log(rotate2, cx, cy)
        //
        // const points = layout.mul(size2 / 2 * s).rotate(rotate2).translate(cx, cy).toPoints()
            // const s = {
            //     head: clamp(unlerp(targetTime.head - noteDuration.value, targetTime.head, scaledTimes(head.group).value.min)),
            //     tail: clamp(unlerp(targetTime.tail - noteDuration.value, targetTime.tail, scaledTimes(tail.group).value.min)),
            // }

            const v = new Vec(0, 1).rotate(-head.lane * Math.PI / 8)

            const pos = {
                head: new Vec(0, 0).add(v.x, v.y).mul(s.head),
                tail: new Vec(0, 0).add(v.x, v.y).mul(s.tail)
            }
            
            const a = -head.lane * (Math.PI / 8)

            const points = new Quad(
                pos.head.add(-0.125 * s.head * Math.cos(a), -0.125 * s.head * Math.sin(a)),
                pos.tail.add(-0.125 * s.tail * Math.cos(a), -0.125 * s.tail * Math.sin(a)),
                pos.tail.add(0.125 * s.tail * Math.cos(a), 0.125 * s.tail * Math.sin(a)),
                pos.head.add(0.125 * s.head * Math.cos(a), 0.125 * s.head * Math.sin(a)),
            ).toPoints()
            // console.log(layout)

            return [{
                points,
                fill: "#ffffff",
                opacity: 0.5
            }]

            // return {
            //     points
            // }
        }),
)
</script>

<template>
    <g stroke="white" stroke-width="0">
        <!--polygon v-for="(polygon, index) in tapNotes" :key="index" v-bind="polygon" /-->
        <template v-for="(connector, index) in connectors.flat()" :key="index">
            <polygon v-bind="connector" />
        </template>
    </g>
</template>
