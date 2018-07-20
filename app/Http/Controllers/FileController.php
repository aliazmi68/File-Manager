<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\File;
use Validator;
use DB;
use Auth;

class FileController extends Controller
{
    public function index(Request $request)
    {
        return ['files' => File::where('user_id', Auth::user()->id)->get()];
    }

    public function store(Request $request)
    {

        $validator = Validator::make($request->file(), [
            'file' => 'required|max:1000000',
        ]);

        if ($validator->fails()) {
            $errors = [];
            foreach ($validator->messages()->all() as $error) {
                array_push($errors, $error);
            }

            return response()->json(['errors' => $errors, 'status' => 400], 400);
        }

        $file = File::create([
            'user_id' => $request->user_id,
            'filename' => pathinfo($request->file('file')->getClientOriginalName(), PATHINFO_FILENAME),
            'type' => $request->file('file')->extension(),
            'size' => $request->file('file')->getClientSize()
        ]);

        $request->file('file')->move(__DIR__ . '/../../../storage/file_uploads/', $file->id . '.' . $file->type);

        return response()->json(['errors' => [], 'files' => File::where('user_id', Auth::user()->id)->get(), 'status' => 200], 200);
    }

    public function destroy($id)
    {
        $file = base_path() .'/public/file_uploads/' . $id;

        if(is_file($file)){
            //  Deleting file from local storage
            unlink($file);

            //  Deleting record from Database
            File::find(explode(".",$id)[0])->delete();

            return response()->json(['errors' => [], 'files' => File::where('user_id', Auth::user()->id)->get(), 'status' => 200], 200);
        }
    }

    public function update(Request $request, $id)
    {

        $file = File::find($id);

        $file->filename = $request->filename;

        $file->save();

        return response()->json(['errors' => [], 'files' => File::where('user_id', Auth::user()->id)->get(), 'status' => 200], 200);

    }

    public function getDownloadLink(Request $request)
    {
        $rand = str_random(16);
        $linkData=[
            'link' => $rand,
            'file_id' => $request->file_id,
            'user_id' => $request->user_id,
            'status' => 0,
        ];

        DB::table('download_links')->insert($linkData);

        return response()->json(['link' => $rand, 'status' => 200]);
    }

    public function downloadFile($link, $id)
    {
        $download_link = DB::table('download_links')->where('link', $link)->get();
        if(!$download_link[0]->status && $download_link[0]->file_id==$id){
            $file = File::find($id);
            $filepath= base_path() .'/storage/file_uploads/' . $id.'.'.$file->type;
	    DB::table('download_links')->where('link', $link)->update(['status' => 1]);
            return response()->download($filepath, $file->filename, [], 'attachment');
        } else{
            return response()->json(['status' => 400], 400);
        }

    }

}
