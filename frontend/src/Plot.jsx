// IMPORT D3.JS AND PRODUCE A PLOT OF THE DATA FOR ONE HOUSEHOLD 
// OR PRODUCE A PLOT OF THE DATA FOR ALL HOUSEHOLDS 
// THIS WILL HELP IN DETECTING ANOMOLIES!

// I will do even better and when a user clicks on a point, the specific household_id and meterpoint_id will show
import { useEffect } from 'react';
import * as d3 from "d3";
import './PlotStyles.css'

// Date x axis and consumpiton value y axis - with import/export in different colours
export const Plot = () => {
    useEffect(() => {
        // Set the dimensions and margins of the plot
        let margin = {top: 10, right: 30, bottom: 40, left: 50},
        width = 520 - margin.left - margin.right,
        height = 520 - margin.top - margin.bottom;

        // Append the svg object to the body of the page
        let svg = d3.select("#consumption_data_plot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        
        // Add x-axis
        let x = d3.scaleLinear()
        .domain([0, 10])
        .range([0, width])

        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(-height*1.3).ticks(10))
        .select(".domain").remove()

        // Add y-axis
        let y = d3.scaleLinear()
        .domain([0,3])
        .range([height, 0])
        .nice()

        svg.append("g")
        .call(d3.axisLeft(y).tickSize(-width*1.3).ticks(7))
        .select(".domain").remove()

        // Customization
        svg.selectAll(".tick line").attr("stroke", "#EBEBEB")

        // Add x-axis label   
        svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + margin.top + 20)
        .text("x-axis");

        // Add y-axis label
        svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -margin.top)
        .text("y-axis")

        // Colour scale: give me a specific consumption type, I return a colour
        let colour = d3.scaleOrdinal()
        .domain(["Import", "Export"])
        .range(["#402D54", "#D18975"])

        // Read the data - collect data from online temp
        const data = [{"household_id": "abcdabcdab", "meter_point_id": 1234567890123, "consumption": {"consumption_type": "Import", "consumption_value": 1.5, "consumption_date": 2}}, {"household_id": "Abcdabcdab", "meter_point_id": 1234567890123, "consumption": {"consumption_type": "Export", "consumption_value": 2.5, "consumption_date": 3}}]

        // Create div - optional use css
        const div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0); // hide the div initially

        // Add dots
        svg.append("g")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.consumption.consumption_date); })
        .attr("cy", function (d) { return y(d.consumption.consumption_value); })
        .attr("r", 5)
        .style("fill", function (d) { return colour(d.consumption.consumption_type) })
        .on('mouseover', function(event, d) {
            console.log(event.pageX)
            d3.select(this).transition()
                .duration('100')
                .attr("r", 7);
            
            // Make div appear
            div.transition()
                .duration(100)
                .style("opacity", 1);

            // Show text in the div by inserting html
            div.html(d.household_id)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 15) + "px");
            

        })
        .on('mouseout', function (event, d) {
            d3.select(this).transition()
                .duration('200')
                .attr("r", 8);
            div.transition()
                .duration('200')
                .style("opacity", 0);
        });
        })
}