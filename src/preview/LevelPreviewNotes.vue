<script setup lang="ts">
import { computed } from 'vue'
import { beats, times, keys, scaledTimes } from '.'
// import { colors } from '../colors'
import { bpms } from '../history/bpms'
import { cullEntities } from '../history/store'
import { timeScales } from '../history/timeScales'
import { beatToTime } from '../state/integrals/bpms'
import { lerp, unlerp } from '../utils/math'
import { state } from "../history"
// import { rotate, resize, moveX, moveY } from './events'
import { getLane } from './lane'
import { noteDuration, tapNoteLayout, approach } from './note'
import { Vec } from "./Vec"

const notes = computed(() =>
    [...cullEntities('note', keys.value.min, keys.value.max)]
        .filter(({ beat }) => beat >= beats.value.min && beat < beats.value.max)
        .sort((a, b) => b.beat - a.beat)
        .map(({ beat, lane, flickDirection, slideId, isStar }) => {
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
            const targetTime = beatToTime(bpms.value, beat)
        //     //const z = unlerp(targetTime - noteDuration.value, targetTime, scaledTimes.value.min)
        //
        const s = unlerp(targetTime - noteDuration.value, targetTime, times.value.min)
        //
        // const angle = (rotate(group).value % 360) / 180 * Math.PI
        // const size2 = resize(group).value
        // const posX = moveX(group).value
        // const posY = moveY(group).value
        //
        // // console.log(s, angle, size2, posX, posY)
        //
        // const rotate2 = angle + (Math.PI / 2 * Math.floor(lane))
        // let cx = posX - size2 * s / 2 * Math.sin(-rotate2) + ((lane % 1) - 0.5) * size2 * s * Math.cos(rotate2)
        // let cy = posY - size2 * s / 2 * Math.cos(rotate2) - ((lane % 1) - 0.5) * size2 * s * Math.sin(-rotate2)
        //
        // // console.log(rotate2, cx, cy)
        //
        // const points = layout.mul(size2 / 2 * s).rotate(rotate2).translate(cx, cy).toPoints()

        const v = new Vec(0, 1).rotate(-lane * Math.PI / 8)
        const layout = new Vec(0, 0).add(v.x, v.y).mul(s)

        const slideNotes = state.value.store.slides.note.get(slideId)!

        // let color = flickDirection === 'left' ? "#f00" : flickDirection === 'right' ? "#f90" : flickDirection === "up" ? "#ff50cb" : flickDirection === 'down' ? "#909" : "#00f"

        // if (slideNotes.length > 1 && flickDirection === 'none') color = "#0f0"

        let isEndHold = false

        if (slideNotes.length > 1) {
            const ln = slideNotes[slideNotes.length - 1]!
            isEndHold = (ln.lane === slideNotes[slideNotes.length - 2]!.lane) && (ln.lane === lane && ln.beat === beat)
        }

        const a = -lane * (Math.PI / 8) * (180 / Math.PI)

        // console.log(layout)

        return {
            cx: layout.x,
            cy: layout.y,
            s,
            a,
            stroke: isEndHold ? "#00000000" : "#fff",
            fill: isEndHold ? "#ffffff99" : "#00000000",
            text: flickDirection === 'left' ? "<" : flickDirection === 'right' ? ">" : "",
            text2: isStar ? "☆" : ""
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
        <template v-for="({ cx, cy, s, a, stroke, fill, text, text2 }, index) in notes" :key="index">
            <circle :cx :cy :r="0.125 * s" :stroke :stroke-width="0.02 * s" :fill />
            <text :x="cx" :y="cy" text-anchor="middle" dominant-baseline="central" fill="#ffff5588" :font-size="0.24 * s" :transform="`rotate(${a}, ${cx}, ${cy})`">{{ text2 }}</text>
            <text :x="cx" :y="cy" text-anchor="middle" dominant-baseline="central" fill="#fff" :font-size="0.36 * s" :transform="`rotate(${a}, ${cx}, ${cy})`">{{ text }}</text>
        </template>
    </g>
</template>
