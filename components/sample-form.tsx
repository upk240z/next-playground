import React from "react"

const SampleForm = ({handle}: any) => {
  return (
    <form onSubmit={handle}>
      <div className="p-3">
        <label>
          <span className="text-gray-700">When is your event?</span>
          <input type="date" className="mt-1"/>
        </label>
      </div>
      <div className="p-3">
        <label>
          <span className="text-gray-700">What type of event is it?</span>
          <select className="mt-1">
            <option>Corporate event</option>
            <option>Wedding</option>
            <option>Birthday</option>
            <option>Other</option>
          </select>
        </label>
      </div>
      <div className="flex">
        <div className="w-6/12 p-3">
          <label>
            <span className="text-gray-700">Key</span>
            <input type="text" className="mt-1" placeholder="" defaultValue="k01" name="key"/>
          </label>
        </div>
        <div className="w-6/12 p-3">
          <label>
            <span className="text-gray-700">Value</span>
            <input type="text" className="mt-1" placeholder="" defaultValue="v01" name="value"/>
          </label>
        </div>
      </div>
      <div className="p-3">
        <button className="btn-primary">Submit</button>
      </div>
    </form>
  )
}

export default SampleForm
