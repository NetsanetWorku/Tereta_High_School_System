<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SubjectController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Subject::all()
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:subjects,name',
            'code' => 'required|unique:subjects,code',
            'credits' => 'nullable|integer|min:1',
            'description' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $subject = Subject::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Subject created successfully',
            'data' => $subject
        ], 201);
    }

    public function show($id)
    {
        $subject = Subject::find($id);

        if (!$subject) {
            return response()->json(['message'=>'Subject not found'], 404);
        }

        return response()->json($subject);
    }

    public function update(Request $request, $id)
    {
        $subject = Subject::find($id);

        if (!$subject) {
            return response()->json([
                'success' => false,
                'message' => 'Subject not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|unique:subjects,name,' . $id,
            'code' => 'sometimes|unique:subjects,code,' . $id,
            'credits' => 'nullable|integer|min:1',
            'description' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $subject->update($request->only(['name', 'code', 'credits', 'description']));

        return response()->json([
            'success' => true,
            'message' => 'Subject updated successfully',
            'data' => $subject
        ]);
    }

    public function destroy($id)
    {
        $subject = Subject::find($id);

        if (!$subject) {
            return response()->json([
                'success' => false,
                'message' => 'Subject not found'
            ], 404);
        }

        $subject->delete();

        return response()->json([
            'success' => true,
            'message' => 'Subject deleted successfully'
        ]);
    }
}
