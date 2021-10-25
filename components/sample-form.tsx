import React from "react"

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem  from '@mui/material/MenuItem'
import {FormControl, InputLabel} from "@mui/material";

const SampleForm = ({handle}: any) => {
  const now = (new Date()).toISOString().substr(0,10)

  return (
    <form onSubmit={handle}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <TextField
          label="When is your event?"
          type="date"
          className="w-full"
          defaultValue={now}
        />

        <FormControl>
          <InputLabel>What type of event is it?</InputLabel>
          <Select
            labelId="demo-simple-select-hoge"
            id="demo-simple-select"
            label="What type of event is it?"
          >
            <MenuItem value={1}>Corporate event</MenuItem>
            <MenuItem value={2}>Wedding</MenuItem>
            <MenuItem value={3}>Birthday</MenuItem>
            <MenuItem value={4}>Other</MenuItem>
          </Select>
        </FormControl>

        <TextField
          name="key"
          label="Timestamp"
          type="text"
          required={true}
          defaultValue="k01"
          className="w-full"
        />
        <TextField
          name="value"
          label="Value"
          type="text"
          required={true}
          defaultValue="v01"
          className="w-full"
        />
      </div>

      <div className="mt-3">
        <Button type="submit" variant="contained" className="w-full">Submit</Button>
      </div>
    </form>
  )
}

export default SampleForm
