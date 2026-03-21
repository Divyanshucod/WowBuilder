## Search & Navigation

1. Enable search functionality to search nodes by:

    1. module name (label)

    2. module ID

2. Highlight matched nodes in the canvas

3. Auto-focus/zoom to the first matched node

4. Handle empty state (no results found)

### Issue is with the canvas own UI which is causing issues with our searchReaults UI, we can skip this part for now

## API Module Support

1. Identify modules with type = "api"

2. Enable API configuration for these modules:

    1. URL

    2. Method

    3. Headers

    4. Query parameters

    5. Body

    6. Variables

2. Create UI to update API details

3. Ensure API config is stored in node data and persists


## Full-Screen Editor (Better UX)

1. Add expand button ({ > }) for modules

2. Open full-height/full-screen editor for editing configs

3. Allow editing API/Form details in expanded view

4. Sync updates back to the same workflow (no duplication)

5. Ensure seamless UX between compact view and expanded view


## Persistence (Local Storage)

1. Store workflow locally (nodes + edges + configs)

2. Auto-load workflow on page reload

3. Add manual “Save” button for user-triggered persistence

4. Ensure uploaded JSON does not overwrite saved progress unintentionally


## Export / Download

1. Enable download of workflow as:

    1. JSON file

    2. PNG image (canvas snapshot)

2. Ensure downloaded data reflects latest state


## Copy / Reuse Modules

1. Add option to copy module/condition JSON

2. Allow user to download or copy JSON on click

3. Provide option to import pasted JSON as new module/condition

4. Ensure imported modules integrate correctly into workflow


## Edge Actions (Dynamic Flow Building)

1. Add clickable controls on edges

2. On edge click, show options:

    1. Add Module

    2. Add Condition

        1. If Module selected:

            1. Show options: API / Form

        2. If Condition selected:

            1. Show condition configuration layout

3. Insert new node between connected nodes dynamically

4. Reconnect edges correctly after insertion


## Form Module Support

1. Allow user to paste JSON for form modules

2. Store and update form schema in node data

3. Handle dynamic nextStep linking


## UX Enhancements (Important polish)

1. Improve scroll handling in side panel

2. Ensure large forms/configs are easy to edit (no cramped UI)

3. Maintain consistent UI feedback for: actions , saves , updates

4. Add clear entry points for all actions (no hidden features)