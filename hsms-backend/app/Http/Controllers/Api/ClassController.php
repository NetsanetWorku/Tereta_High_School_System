<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClassRoom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ClassController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => ClassRoom::all()
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string',
            'section'  => 'required|string',
            'grade'    => 'nullable|string',
            'capacity' => 'nullable|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $classData = $request->only(['name', 'section', 'grade', 'capacity']);
        
        $class = ClassRoom::create($classData);

        return response()->json([
            'success' => true,
            'message' => 'Class created successfully',
            'data'    => $class
        ], 201);
    }

    public function show($id)
    {
        $class = ClassRoom::find($id);

        if (!$class) {
            return response()->json(['message'=>'Class not found'], 404);
        }

        return response()->json($class);
    }

    public function update(Request $request, $id)
    {
        $class = ClassRoom::find($id);

        if (!$class) {
            return response()->json(['message'=>'Class not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'     => 'sometimes|string',
            'section'  => 'sometimes|string',
            'grade'    => 'nullable|string',
            'capacity' => 'nullable|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $updateData = $request->only(['name', 'section', 'grade', 'capacity']);
        $class->update($updateData);

        return response()->json([
            'success' => true,
            'message'=>'Class updated successfully',
            'data' => $class
        ]);
    }

    public function destroy($id)
    {
        $class = ClassRoom::find($id);

        if (!$class) {
            return response()->json(['message'=>'Class not found'], 404);
        }

        $class->delete();

        return response()->json([
            'message'=>'Class deleted successfully'
        ]);
    }
}
