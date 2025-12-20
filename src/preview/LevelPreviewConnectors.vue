<script setup lang="ts">
import { computed } from 'vue'
import { beats, keys, scaledTimes } from '.'
// import { colors } from '../colors'
import { bpms } from '../history/bpms'
import { cullEntities } from '../history/store'
import { timeScales } from '../history/timeScales'
import { beatToTime } from '../state/integrals/bpms'
import { timeToScaledTime } from '../state/integrals/timeScales'
import { lerp, unlerp, clamp } from '../utils/math'
import { state } from "../history"
// import { rotate, resize, moveX, moveY } from './events'
import { getLane } from './lane'
import { noteDuration, tapNoteLayout, approach } from './note'
import { Vec } from "./Vec"
import { Quad } from "./Quad"

const connectors = computed(() =>
    [...cullEntities('connector', keys.value.min, keys.value.max)]
//        .filter(({ head, tail }) => tail.beat >= beats(tail.group).value.min || head.beat < beats(head.group).value.max)
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
            head: timeToScaledTime(timeScales.value.filter(t => t.group === head.group), beatToTime(bpms.value, head.beat)),
            tail: timeToScaledTime(timeScales.value.filter(t => t.group === tail.group), beatToTime(bpms.value, tail.beat))
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
                head: clamp(unlerp(targetTime.head - noteDuration.value, targetTime.head, scaledTimes(head.group).value.min)),
                tail: clamp(unlerp(targetTime.tail - noteDuration.value, targetTime.tail, scaledTimes(tail.group).value.min)),
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
        if (head.lane === tail.lane) {
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
                pos.head.add(-0.08 * s.head * Math.cos(a), -0.08 * s.head * Math.sin(a)),
                pos.tail.add(-0.08 * s.tail * Math.cos(a), -0.08 * s.tail * Math.sin(a)),
                pos.tail.add(0.08 * s.tail * Math.cos(a), 0.08 * s.tail * Math.sin(a)),
                pos.head.add(0.08 * s.head * Math.cos(a), 0.08 * s.head * Math.sin(a)),
            ).toPoints()
            // console.log(layout)

            return [{
                points,
                fill: "#ffffff",
                opacity: 0.5
            }]
        } else {
            const t = scaledTimes(head.group).value

            const visibleTime = {
                min: Math.max(targetTime.head, t.min),
                max: Math.min(targetTime.tail, t.max)
            }

            const segs: { points: string, fill: string, opacity: string }[] = []
            const div = Math.ceil(Math.abs(s.head - s.tail) * 20)
            //console.log("div", div, t)

            for (let i = 0; i < div; i++) {
                const scaledTime = {
                    min: lerp(visibleTime.min, visibleTime.max, i / div),
                    max: lerp(visibleTime.min, visibleTime.max, (i + 1) / div)
                }

                const s = {
                    min: unlerp(scaledTime.min - noteDuration.value, scaledTime.min, t.min),
                    max: unlerp(scaledTime.max - noteDuration.value, scaledTime.max, t.min),
                }

                const lane = {
                    min: lerp(head.lane, tail.lane, clamp(unlerp(targetTime.head, targetTime.tail, scaledTime.min))),
                    max: lerp(head.lane, tail.lane, clamp(unlerp(targetTime.head, targetTime.tail, scaledTime.max))),
                }

                const v = {
                    min: new Vec(0, 1).rotate(-lane.min * Math.PI / 8),
                    max: new Vec(0, 1).rotate(-lane.max * Math.PI / 8),
                }

                const pos = {
                    min: new Vec(0, 0).add(v.min.x, v.min.y).mul(s.min),
                    max: new Vec(0, 0).add(v.max.x, v.max.y).mul(s.max)
                }
                
                const a = {
                    min: -lane.min * (Math.PI / 8),
                    max: -lane.max * (Math.PI / 8)
                }

                const points = new Quad(
                    pos.min.add(-0.08 * s.min * Math.cos(a.min), -0.08 * s.min * Math.sin(a.min)),
                    pos.max.add(-0.08 * s.max * Math.cos(a.max), -0.08 * s.max * Math.sin(a.max)),
                    pos.max.add(0.08 * s.max * Math.cos(a.max), 0.08 * s.max * Math.sin(a.max)),
                    pos.min.add(0.08 * s.min * Math.cos(a.min), 0.08 * s.min * Math.sin(a.min)),
                ).toPoints()

                segs.push({
                    points,
                    fill: "#ffffff",
                    opacity: 0.5
                })
                //console.log(scaledTime, s, lane, v, pos, a, points)
            }

            return segs
        }

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
