'use strict'


// this program generates a schedule out of an input consisting of an array (supposedly read from a csv file. here we just represent it as an array)
// of objects where each object represents a speaker. The duration of the speakers are either 30 or 50 minutes with break inbetween of 15 mins.
// Between 12:00 and 13:00 hrs there is a lunch break.

const ctable = require('console.table')

const toHrs = (min) => { return min/60 }
const toHrMin = ( time ) => {
    var int_part = Math.trunc (time) 
    var decimal_part = Number((time-int_part).toFixed(2));
    var decimal_part_tomins = Math.round(decimal_part*60)
    return `${int_part} hr ${decimal_part_tomins} mins`
}


const INPUT_ARRAY = [
    { index:0, title: "ta", duration: toHrs(30), speaker: "speaker1" },
    { index:1, title: "tb", duration: toHrs(50), speaker: "speaker2" },
    { index:2, title: "tc", duration: toHrs(30), speaker: "speaker3" },
    { index:3, title: "td", duration: toHrs(30), speaker: "speaker4"},
    { index:4, title: "te", duration: toHrs(30), speaker: "speaker5"},
    { index:5, title: "tf", duration: toHrs(50), speaker: "speaker6"},
    { index:6, title: "tg", duration: toHrs(50), speaker: "speaker7"},
    { index:7, title: "th", duration: toHrs(30), speaker: "speaker8"},
    { index:8, title: "ti", duration: toHrs(50), speaker: "speaker9"},
    { index:9, title: "tj", duration: toHrs(30), speaker: "speaker10"},
    { index:10, title: "tk", duration: toHrs(50), speaker: "speaker11"},
    { index:11, title: "tl", duration: toHrs(50), speaker: "speaker12"},
    { index:12, title: "tm", duration: toHrs(50), speaker: "speaker13"},
    { index:13, title: "tn", duration: toHrs(30), speaker: "speaker14"},
]

const START_HRS   = 9
const BREAK_START = 12
const BREAK_END   = 13
const END_HRS     = 17

const CLEANING_BREAKS = toHrs(15); // 15 mins expressed in ration of hour. Hour = 60 mins.
   

const SLOT_BUCKETS = [
    {dayindex:0, startTime: START_HRS, endTime:BREAK_START, talks: [], next_talk_start_time: START_HRS},
    {dayindex:0, startTime: BREAK_END, endTime:END_HRS, talks: [], next_talk_start_time: START_HRS},
    {dayindex:1, startTime: START_HRS, endTime:BREAK_START, talks: [], next_talk_start_time: START_HRS},
    {dayindex:1, startTime: BREAK_END, endTime:END_HRS, talks: [], next_talk_start_time: START_HRS},
    {dayindex:2, startTime: START_HRS, endTime:BREAK_START, talks: [], next_talk_start_time: START_HRS},
    {dayindex:2, startTime: BREAK_END, endTime:END_HRS, talks: [], next_talk_start_time: START_HRS}
]


class Schedule{
    constructor(input_array, slot_buckets) {
	this.input_array = input_array
	this.slot_buckets = slot_buckets
    }

    _sort_descending() {

	return this.input_array.sort( (e1, e2) => {
	    return (e2.duration - e1.duration);
	})

    }

    fill_slots() {
	
	let sorted_input = this._sort_descending()

	//now iterate and fill in the buckets. Most optimal filling would ensure that the conference has least amount of wasted time in between talks( albeit the breaks)

	sorted_input.map( entry => {
	    var self = this

	    for ( let bucket of self.slot_buckets ) {

		if ( bucket.endTime > (bucket.next_talk_start_time + entry.duration)) {
		    
		    const talk_entry = {
			index: entry.index,
			start_time : bucket.next_talk_start_time,
			end_time   : bucket.next_talk_start_time + entry.duration
		    };
		    
		    bucket.talks.push(talk_entry)
		    bucket.next_talk_start_time += entry.duration + CLEANING_BREAKS		    
		    break;
		
		}		
	    }
	})	

    }

    pprint_output() {

	let print_table = []
	
	this.slot_buckets.map( bucket => {
	    
	    bucket.talks.map( talk => {

		var table_entry = {
		    Day        : bucket.dayindex+1,
		    Start_time : toHrMin(talk.start_time),
		    End_time   : toHrMin(talk.end_time),
		    title      : this.input_array[talk.index].title,
		    speaker    : this.input_array[talk.index].speaker
		}

		print_table.push(table_entry)
	    })
	})

	console.table(print_table)
    }


}



if (require.main === module) {
    console.log('called directly');
    let schedule = new Schedule(INPUT_ARRAY, SLOT_BUCKETS)
    schedule.fill_slots()
    schedule.pprint_output()         

} else {
    console.log('required as a module');
}
